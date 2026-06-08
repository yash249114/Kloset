package payment

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

func (r *Repository) Create(tx *Transaction) error {
	return r.db.Create(tx).Error
}

func (r *Repository) FindByID(id uuid.UUID) (*Transaction, error) {
	var tx Transaction
	err := r.db.First(&tx, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &tx, nil
}

func (r *Repository) FindByUserID(userID uuid.UUID, limit, offset int) ([]Transaction, int64, error) {
	var txs []Transaction
	var total int64

	query := r.db.Model(&Transaction{}).Where("user_id = ?", userID)
	query.Count(&total)

	err := query.
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&txs).Error

	return txs, total, err
}

func (r *Repository) FindByBookingID(bookingID uuid.UUID) ([]Transaction, error) {
	var txs []Transaction
	err := r.db.Where("booking_id = ?", bookingID).Order("created_at DESC").Find(&txs).Error
	return txs, err
}

func (r *Repository) FindAll(limit, offset int) ([]Transaction, int64, error) {
	var txs []Transaction
	var total int64

	query := r.db.Model(&Transaction{})
	query.Count(&total)

	err := query.
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&txs).Error

	return txs, total, err
}

func (r *Repository) Update(tx *Transaction) error {
	return r.db.Save(tx).Error
}
