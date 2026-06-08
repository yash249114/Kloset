package dispute

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

func (r *Repository) Create(dispute *Dispute) error {
	return r.db.Create(dispute).Error
}

func (r *Repository) FindByID(id uuid.UUID) (*Dispute, error) {
	var dispute Dispute
	err := r.db.Preload("Booking").First(&dispute, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &dispute, nil
}

func (r *Repository) FindAll(limit, offset int) ([]Dispute, int64, error) {
	var disputes []Dispute
	var total int64

	query := r.db.Model(&Dispute{})
	query.Count(&total)

	err := query.
		Preload("Booking").
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&disputes).Error

	return disputes, total, err
}

func (r *Repository) Update(dispute *Dispute) error {
	return r.db.Save(dispute).Error
}
