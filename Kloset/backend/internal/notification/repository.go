package notification

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByUserID(userID uuid.UUID, limit, offset int) ([]Notification, int64, error) {
	var notifs []Notification
	var total int64

	query := r.db.Model(&Notification{}).Where("user_id = ?", userID)
	query.Count(&total)

	err := query.
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&notifs).Error

	return notifs, total, err
}

func (r *Repository) FindUnreadCount(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&Notification{}).Where("user_id = ? AND is_read = false", userID).Count(&count).Error
	return count, err
}

func (r *Repository) MarkAsRead(id uuid.UUID, userID uuid.UUID) error {
	return r.db.Model(&Notification{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("is_read", true).Error
}

func (r *Repository) MarkAllAsRead(userID uuid.UUID) error {
	return r.db.Model(&Notification{}).
		Where("user_id = ? AND is_read = false", userID).
		Update("is_read", true).Error
}

func (r *Repository) Create(notif *Notification) error {
	return r.db.Create(notif).Error
}
