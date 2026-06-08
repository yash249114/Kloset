package auth

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/kloset/backend/pkg/utils"
)

func TestHashToken(t *testing.T) {
	token := "my-secret-refresh-token-123"
	hash1 := HashToken(token)
	hash2 := HashToken(token)

	if hash1 != hash2 {
		t.Errorf("HashToken output is not deterministic: %s vs %s", hash1, hash2)
	}

	if len(hash1) != 64 {
		t.Errorf("Expected SHA-256 hex hash length to be 64 characters, got %d", len(hash1))
	}
}

func TestToUserResponse(t *testing.T) {
	userId := uuid.New()
	avatar := "https://avatar.url/avatar.jpg"
	
	user := &User{
		ID:            userId,
		Name:          "Madhuri Dixit",
		Email:         "madhuri@gmail.com",
		Phone:         "+91 99999 88888",
		Role:          "renter",
		AvatarURL:     &avatar,
		IsVerified:    true,
		KYCStatus:     "approved",
		WalletBalance: 1200.50,
		TrustScore:    98,
		CreatedAt:     time.Date(2026, time.May, 30, 10, 0, 0, 0, time.UTC),
	}

	resp := user.ToUserResponse()

	if resp.ID != userId.String() {
		t.Errorf("Expected response ID %s, got %s", userId.String(), resp.ID)
	}
	if resp.Name != "Madhuri Dixit" {
		t.Errorf("Expected response Name 'Madhuri Dixit', got '%s'", resp.Name)
	}
	if resp.Email != "madhuri@gmail.com" {
		t.Errorf("Expected response Email 'madhuri@gmail.com', got '%s'", resp.Email)
	}
	if resp.Phone != "+91 99999 88888" {
		t.Errorf("Expected response Phone '+91 99999 88888', got '%s'", resp.Phone)
	}
	if resp.Role != "renter" {
		t.Errorf("Expected response Role 'renter', got '%s'", resp.Role)
	}
	if resp.AvatarURL == nil || *resp.AvatarURL != avatar {
		t.Errorf("Expected response AvatarURL '%s', got '%v'", avatar, resp.AvatarURL)
	}
	if !resp.IsVerified {
		t.Errorf("Expected response IsVerified to be true")
	}
	if resp.KYCStatus != "approved" {
		t.Errorf("Expected response KYCStatus 'approved', got '%s'", resp.KYCStatus)
	}
	if resp.WalletBalance != 1200.50 {
		t.Errorf("Expected response WalletBalance 1200.50, got %f", resp.WalletBalance)
	}
	if resp.TrustScore != 98 {
		t.Errorf("Expected response TrustScore 98, got %d", resp.TrustScore)
	}
}

func TestPasswordHelpers(t *testing.T) {
	password := "SecretKlosetPass!123"
	
	hash, err := utils.HashPassword(password)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	if hash == password {
		t.Fatal("HashPassword returned cleartext password")
	}

	if !utils.CheckPassword(password, hash) {
		t.Error("CheckPassword failed to verify correct password")
	}

	if utils.CheckPassword("WrongPass!", hash) {
		t.Error("CheckPassword verified incorrect password")
	}
}
