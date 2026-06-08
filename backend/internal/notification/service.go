package notification

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/kloset/backend/internal/email"
	"github.com/kloset/backend/internal/user"
	"github.com/rs/zerolog/log"
)

type Service struct {
	repo     *Repository
	emailSvc *email.Service
	userRepo *user.Repository
}

func NewService(repo *Repository, emailSvc *email.Service, userRepo *user.Repository) *Service {
	return &Service{
		repo:     repo,
		emailSvc: emailSvc,
		userRepo: userRepo,
	}
}

func (s *Service) ListNotifications(userID string, page, perPage int) ([]Notification, int64, int64, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, 0, 0, errors.New("invalid user id")
	}

	offset := (page - 1) * perPage
	notifs, total, err := s.repo.FindByUserID(userUUID, perPage, offset)
	if err != nil {
		return nil, 0, 0, err
	}

	unread, _ := s.repo.FindUnreadCount(userUUID)

	return notifs, total, unread, nil
}

func (s *Service) MarkAsRead(idStr string, userID string) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return errors.New("invalid notification id")
	}

	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user id")
	}

	return s.repo.MarkAsRead(id, userUUID)
}

func (s *Service) MarkAllAsRead(userID string) error {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user id")
	}

	return s.repo.MarkAllAsRead(userUUID)
}

func serializeChannels(channels []string) string {
	if len(channels) == 0 {
		return "{in_app}"
	}
	res := "{"
	for i, c := range channels {
		if i > 0 {
			res += ","
		}
		res += c
	}
	res += "}"
	return res
}

func (s *Service) Create(userIDStr string, notifType string, title string, body string, channels []string, data map[string]interface{}) error {
	userUUID, err := uuid.Parse(userIDStr)
	if err != nil {
		return errors.New("invalid user id")
	}

	hasInApp := false
	hasEmail := false
	for _, c := range channels {
		if c == "in_app" {
			hasInApp = true
		}
		if c == "email" {
			hasEmail = true
		}
	}

	// Always default to log in db if hasInApp or channels list is empty
	if len(channels) == 0 || hasInApp {
		now := time.Now()
		notif := Notification{
			ID:        uuid.New(),
			UserID:    userUUID,
			Type:      notifType,
			Title:     title,
			Body:      body,
			Channels:  serializeChannels(channels),
			IsRead:    false,
			SentAt:    &now,
			CreatedAt: now,
		}

		if data != nil {
			if jsonBytes, err := json.Marshal(data); err == nil {
				jsonStr := string(jsonBytes)
				notif.Data = &jsonStr
			}
		}

		if err := s.repo.Create(&notif); err != nil {
			log.Error().Err(err).Msg("Failed to write notification to DB")
		}
	}

	// Dispatch email if requested and email service is configured
	if hasEmail && s.emailSvc != nil && s.userRepo != nil {
		u, err := s.userRepo.FindByID(userUUID)
		if err != nil {
			log.Error().Err(err).Str("user_id", userIDStr).Msg("Failed to load user for email notification")
			return err
		}

		var emailErr error
		switch notifType {
		case "welcome":
			emailErr = s.emailSvc.SendWelcome(u.Email, u.Name)
		case "kyc_verified":
			emailErr = s.emailSvc.SendKYCApproved(u.Email, u.Name)
		case "kyc_rejected":
			reason, _ := data["reason"].(string)
			emailErr = s.emailSvc.SendKYCRejected(u.Email, u.Name, reason)
		case "booking_confirmed":
			ref, _ := data["ref"].(string)
			amountVal, _ := data["amount"].(float64)
			emailErr = s.emailSvc.SendBookingConfirmation(u.Email, u.Name, ref, amountVal)
		case "booking_cancelled":
			ref, _ := data["ref"].(string)
			reason, _ := data["reason"].(string)
			emailErr = s.emailSvc.SendBookingCancellation(u.Email, ref, reason)
		case "pickup_reminder", "return_reminder":
			ref, _ := data["ref"].(string)
			dateStr, _ := data["date"].(string)
			isPickup, _ := data["isPickup"].(bool)
			emailErr = s.emailSvc.SendBookingReminder(u.Email, u.Name, ref, dateStr, isPickup)
		case "deposit_refunded":
			ref, _ := data["ref"].(string)
			amountVal, _ := data["amount"].(float64)
			emailErr = s.emailSvc.SendRefundCompleted(u.Email, ref, amountVal)
		case "listing_approved":
			titleVal, _ := data["title"].(string)
			emailErr = s.emailSvc.SendSellerListingApproved(u.Email, u.Name, titleVal)
		case "listing_rejected":
			titleVal, _ := data["title"].(string)
			reason, _ := data["reason"].(string)
			emailErr = s.emailSvc.SendSellerListingRejected(u.Email, u.Name, titleVal, reason)
		case "booking_request":
			ref, _ := data["ref"].(string)
			titleVal, _ := data["title"].(string)
			pickupDate, _ := data["pickupDate"].(string)
			emailErr = s.emailSvc.SendSellerBookingAlert(u.Email, u.Name, ref, titleVal, pickupDate)
		case "support_ticket_created":
			ticketID, _ := data["ticketID"].(string)
			subj, _ := data["subject"].(string)
			emailErr = s.emailSvc.SendSupportTicketCreated(u.Email, u.Name, ticketID, subj)
		case "support_ticket_updated":
			ticketID, _ := data["ticketID"].(string)
			updates, _ := data["updates"].(string)
			emailErr = s.emailSvc.SendSupportTicketUpdated(u.Email, u.Name, ticketID, updates)
		case "support_ticket_closed":
			ticketID, _ := data["ticketID"].(string)
			emailErr = s.emailSvc.SendSupportTicketClosed(u.Email, u.Name, ticketID)
		default:
			log.Warn().Str("type", notifType).Msg("Unknown notification type for email dispatch")
		}

		if emailErr != nil {
			log.Error().Err(emailErr).Str("to", u.Email).Str("type", notifType).Msg("Failed to dispatch email notification")
		}
	}

	return nil
}
