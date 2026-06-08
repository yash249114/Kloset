package utils

import (
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// DestroyCloudinaryImage destroys an image on Cloudinary securely using server secret
func DestroyCloudinaryImage(cloudName, apiKey, apiSecret, publicID string) error {
	if cloudName == "" || apiKey == "" || apiSecret == "" || publicID == "" {
		return fmt.Errorf("missing Cloudinary configuration or public ID")
	}

	timestamp := strconv.FormatInt(time.Now().Unix(), 10)

	// Signature string formula: public_id=<public_id>&timestamp=<timestamp><api_secret>
	signatureRaw := fmt.Sprintf("public_id=%s&timestamp=%s%s", publicID, timestamp, apiSecret)

	// Calculate SHA-1 hex hash
	h := sha1.New()
	h.Write([]byte(signatureRaw))
	signature := hex.EncodeToString(h.Sum(nil))

	// Prepare request payload
	formData := url.Values{}
	formData.Set("public_id", publicID)
	formData.Set("api_key", apiKey)
	formData.Set("timestamp", timestamp)
	formData.Set("signature", signature)

	destroyURL := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/destroy", cloudName)

	resp, err := http.PostForm(destroyURL, formData)
	if err != nil {
		return fmt.Errorf("failed to make HTTP request to Cloudinary: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("cloudinary destroy failed with status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
