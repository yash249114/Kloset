package dispute

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/kloset/backend/internal/booking"
	"github.com/kloset/backend/internal/logging"
	"github.com/kloset/backend/internal/notification"
	"gorm.io/gorm"
)

type Service struct {
	repo     *Repository
	notifSvc *notification.Service
	logSvc   *logging.Service
}

type RaiseDisputePayload struct {
	BookingID      string  `json:"booking_id" validate:"required"`
	Reason         string  `json:"reason" validate:"required"`
	Description    string  `json:"description" validate:"required"`
	EvidencePhotos *string `json:"evidence_photos"`
}

func NewService(repo *Repository, notifSvc *notification.Service, logSvc *logging.Service) *Service {
	return &Service{
		repo:     repo,
		notifSvc: notifSvc,
		logSvc:   logSvc,
	}
}

func (s *Service) RaiseDispute(raisedByID string, req *RaiseDisputePayload) (*Dispute, error) {
	bookingUUID, err := uuid.Parse(req.BookingID)
	if err != nil {
		return nil, errors.New("invalid booking id")
	}

	raisedByUUID, err := uuid.Parse(raisedByID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	// Fetch booking details
	var b booking.Booking
	if err := s.repo.db.First(&b, "id = ?", bookingUUID).Error; err != nil {
		return nil, errors.New("booking not found")
	}

	if b.RenterID != raisedByUUID && b.SellerID != raisedByUUID {
		return nil, errors.New("you must be the renter or seller of this booking to raise a dispute")
	}

	if b.Status == "cancelled" || b.Status == "pending" {
		return nil, errors.New("cannot raise a dispute on pending or cancelled bookings")
	}

	againstUUID := b.SellerID
	if raisedByUUID == b.SellerID {
		againstUUID = b.RenterID
	}

	dispute := &Dispute{
		ID:             uuid.New(),
		BookingID:      bookingUUID,
		RaisedBy:       raisedByUUID,
		Against:        againstUUID,
		Reason:         req.Reason,
		Description:    req.Description,
		EvidencePhotos: req.EvidencePhotos,
		Status:         "open",
	}

	// Save dispute and set booking status to disputed
	err = s.repo.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(dispute).Error; err != nil {
			return err
		}
		if err := tx.Table("bookings").Where("id = ?", b.ID).Update("status", "disputed").Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to raise dispute: %w", err)
	}

	// Log notifications to both users
	_ = s.createInAppNotification(raisedByUUID, "dispute_raised", "Dispute Raised", fmt.Sprintf("You have successfully raised a dispute for order %s.", b.BookingRef))
	_ = s.createInAppNotification(againstUUID, "dispute_raised", "Dispute Raised Against You", fmt.Sprintf("A dispute has been raised against you for order %s. Our support team is reviewing.", b.BookingRef))

	if s.logSvc != nil {
		s.logSvc.LogEvent(raisedByID, "Raised dispute for Booking Ref: "+b.BookingRef+" due to: "+req.Reason, "127.0.0.1", "warn")
	}

	return dispute, nil
}

func (s *Service) GetDispute(idStr, userID string) (*Dispute, error) {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return nil, errors.New("invalid dispute id")
	}

	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	dispute, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if dispute == nil {
		return nil, errors.New("dispute not found")
	}

	var userRole string
	_ = s.repo.db.Table("users").Select("role").Where("id = ?", userUUID).Scan(&userRole).Error

	if dispute.RaisedBy != userUUID && dispute.Against != userUUID && userRole != "admin" {
		return nil, errors.New("unauthorized to view this dispute")
	}

	return dispute, nil
}

func (s *Service) createInAppNotification(userID uuid.UUID, notifType, title, body string) error {
	if s.notifSvc == nil {
		return nil
	}
	return s.notifSvc.Create(userID.String(), notifType, title, body, []string{"in_app"}, nil)
}
