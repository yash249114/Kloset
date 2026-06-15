package payment

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"net/http"
	"time"
)

type RazorpayClient struct {
	KeyID         string
	KeySecret     string
	WebhookSecret string
}

func NewRazorpayClient(keyID, keySecret, webhookSecret string) *RazorpayClient {
	return &RazorpayClient{
		KeyID:         keyID,
		KeySecret:     keySecret,
		WebhookSecret: webhookSecret,
	}
}

// CreateOrder creates a Razorpay order ID
func (c *RazorpayClient) CreateOrder(amount float64, receipt string) (string, error) {
	amountInPaise := int(math.Round(amount * 100))

	payload := map[string]interface{}{
		"amount":   amountInPaise,
		"currency": "INR",
		"receipt":  receipt,
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}

	authString := fmt.Sprintf("%s:%s", c.KeyID, c.KeySecret)
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(authString))

	req.Header.Set("Authorization", "Basic "+encodedAuth)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		var errResp map[string]interface{}
		_ = json.NewDecoder(resp.Body).Decode(&errResp)
		return "", fmt.Errorf("razorpay order creation endpoint returned %d: %v", resp.StatusCode, errResp)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	orderID, ok := result["id"].(string)
	if !ok {
		return "", errors.New("razorpay did not return order id field")
	}

	return orderID, nil
}

// VerifySignature checks standard payment checkout signature
func (c *RazorpayClient) VerifySignature(orderID, paymentID, signature string) bool {
	data := orderID + "|" + paymentID
	h := hmac.New(sha256.New, []byte(c.KeySecret))
	h.Write([]byte(data))
	expectedSig := hex.EncodeToString(h.Sum(nil))
	return expectedSig == signature
}

// VerifyWebhookSignature checks Razorpay Webhook signature
func (c *RazorpayClient) VerifyWebhookSignature(payload []byte, signature string) bool {
	h := hmac.New(sha256.New, []byte(c.WebhookSecret))
	h.Write(payload)
	expectedSig := hex.EncodeToString(h.Sum(nil))
	return expectedSig == signature
}

// RefundPayment issues a refund via Razorpay API
func (c *RazorpayClient) RefundPayment(paymentID string, amount float64, reason string) (string, error) {
	amountInPaise := int(math.Round(amount * 100))

	payload := map[string]interface{}{
		"amount": amountInPaise,
		"notes": map[string]string{
			"reason": reason,
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("https://api.razorpay.com/v1/payments/%s/refund", paymentID)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}

	authString := fmt.Sprintf("%s:%s", c.KeyID, c.KeySecret)
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(authString))

	req.Header.Set("Authorization", "Basic "+encodedAuth)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		var errResp map[string]interface{}
		_ = json.NewDecoder(resp.Body).Decode(&errResp)
		return "", fmt.Errorf("razorpay refund API returned status %d: %v", resp.StatusCode, errResp)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	refundID, ok := result["id"].(string)
	if !ok {
		return "", errors.New("razorpay did not return refund id")
	}

	return refundID, nil
}
