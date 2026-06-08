package support

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/kloset/backend/internal/notification"
	"gorm.io/gorm"
)

type Service struct {
	db       *gorm.DB
	notifSvc *notification.Service
}

type ChatMessage struct {
	Sender    string `json:"sender"`
	Text      string `json:"text"`
	Timestamp string `json:"timestamp"`
}

func NewService(db *gorm.DB, notifSvc *notification.Service) *Service {
	return &Service{db: db, notifSvc: notifSvc}
}

func (s *Service) CreateTicket(ticket *SupportTicket) error {
	ticket.ID = fmt.Sprintf("TKT-%d", 10000000+time.Now().UnixNano()%90000000)
	ticket.Status = "open"
	ticket.CreatedAt = time.Now()

	// Parse initial description into history
	history := []ChatMessage{
		{
			Sender:    "user",
			Text:      ticket.Description,
			Timestamp: time.Now().Format("03:04 PM"),
		},
	}
	historyBytes, _ := json.Marshal(history)
	ticket.ChatHistory = string(historyBytes)

	if err := s.db.Create(ticket).Error; err != nil {
		return err
	}

	// Trigger notifications
	var u struct {
		ID uuid.UUID
	}
	err := s.db.Table("users").Select("id").Where("email = ?", ticket.RenterEmail).Scan(&u).Error
	if err == nil && u.ID != uuid.Nil {
		_ = s.notifSvc.Create(
			u.ID.String(),
			"support_ticket_created",
			"Support Ticket Opened",
			fmt.Sprintf("Support ticket %s has been created for subject: %s.", ticket.ID, ticket.Subject),
			[]string{"in_app", "email"},
			map[string]interface{}{
				"ticketID": ticket.ID,
				"subject":  ticket.Subject,
			},
		)
	}

	return nil
}

func (s *Service) ListUserTickets(email string) ([]SupportTicket, error) {
	var tickets []SupportTicket
	err := s.db.Where("renter_email = ?", email).Order("created_at DESC").Find(&tickets).Error
	return tickets, err
}

func (s *Service) ListAllTickets() ([]SupportTicket, error) {
	var tickets []SupportTicket
	err := s.db.Order("created_at DESC").Find(&tickets).Error
	return tickets, err
}

func (s *Service) UpdateStatus(id string, status string) (*SupportTicket, error) {
	var t SupportTicket
	if err := s.db.First(&t, "id = ?", id).Error; err != nil {
		return nil, err
	}

	t.Status = status
	if err := s.db.Save(&t).Error; err != nil {
		return nil, err
	}

	// Trigger notification
	var u struct {
		ID uuid.UUID
	}
	err := s.db.Table("users").Select("id").Where("email = ?", t.RenterEmail).Scan(&u).Error
	if err == nil && u.ID != uuid.Nil {
		notifType := "support_ticket_updated"
		notifTitle := "Support Ticket Updated"
		notifBody := fmt.Sprintf("Your ticket %s status has been updated to: %s.", t.ID, status)

		if status == "resolved" || status == "closed" {
			notifType = "support_ticket_closed"
			notifTitle = "Support Ticket Resolved"
			notifBody = fmt.Sprintf("Your ticket %s has been resolved and closed.", t.ID)
		}

		_ = s.notifSvc.Create(
			u.ID.String(),
			notifType,
			notifTitle,
			notifBody,
			[]string{"in_app", "email"},
			map[string]interface{}{
				"ticketID": t.ID,
				"updates":  fmt.Sprintf("Status changed to: %s", status),
			},
		)
	}

	return &t, nil
}

func (s *Service) AddAgentReply(id string, text string) (*SupportTicket, error) {
	var t SupportTicket
	if err := s.db.First(&t, "id = ?", id).Error; err != nil {
		return nil, err
	}

	var history []ChatMessage
	_ = json.Unmarshal([]byte(t.ChatHistory), &history)

	history = append(history, ChatMessage{
		Sender:    "agent",
		Text:      text,
		Timestamp: time.Now().Format("03:04 PM"),
	})

	historyBytes, _ := json.Marshal(history)
	t.ChatHistory = string(historyBytes)
	
	// Set status to in-progress if currently open
	if t.Status == "open" {
		t.Status = "in-progress"
	}

	if err := s.db.Save(&t).Error; err != nil {
		return nil, err
	}

	// Notify renter
	var u struct {
		ID uuid.UUID
	}
	err := s.db.Table("users").Select("id").Where("email = ?", t.RenterEmail).Scan(&u).Error
	if err == nil && u.ID != uuid.Nil {
		_ = s.notifSvc.Create(
			u.ID.String(),
			"support_ticket_updated",
			"New Message on Support Ticket",
			fmt.Sprintf("An agent has replied to your support ticket %s.", t.ID),
			[]string{"in_app", "email"},
			map[string]interface{}{
				"ticketID": t.ID,
				"updates":  fmt.Sprintf("Agent Reply: %s", text),
			},
		)
	}

	return &t, nil
}
