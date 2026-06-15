package user

import (
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Repository handles database operations for users
type Repository struct {
	db *gorm.DB
}

// NewRepository creates a new user repository
func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// FindByID finds a user by UUID with addresses
func (r *Repository) FindByID(id uuid.UUID) (*User, error) {
	var user User
	err := r.db.Preload("Addresses").Where("id = ? AND deleted_at IS NULL", id).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// UpdateProfile updates user profile fields
func (r *Repository) UpdateProfile(id uuid.UUID, updates map[string]interface{}) error {
	return r.db.Model(&User{}).Where("id = ?", id).Updates(updates).Error
}

// GetAddresses returns all addresses for a user
func (r *Repository) GetAddresses(userID uuid.UUID) ([]UserAddress, error) {
	var addresses []UserAddress
	err := r.db.Where("user_id = ?", userID).Order("is_default DESC, created_at DESC").Find(&addresses).Error
	return addresses, err
}

// CreateAddress adds a new address
func (r *Repository) CreateAddress(address *UserAddress) error {
	// If this is set as default, unset other defaults first
	if address.IsDefault {
		r.db.Model(&UserAddress{}).Where("user_id = ?", address.UserID).Update("is_default", false)
	}
	return r.db.Create(address).Error
}

// UpdateAddress updates an existing address
func (r *Repository) UpdateAddress(id, userID uuid.UUID, updates map[string]interface{}) error {
	return r.db.Model(&UserAddress{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error
}

// DeleteAddress removes an address
func (r *Repository) DeleteAddress(id, userID uuid.UUID) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&UserAddress{}).Error
}

// SetDefaultAddress sets an address as default and unsets others
func (r *Repository) SetDefaultAddress(id, userID uuid.UUID) error {
	tx := r.db.Begin()

	// Unset all defaults
	if err := tx.Model(&UserAddress{}).Where("user_id = ?", userID).Update("is_default", false).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Set new default
	if err := tx.Model(&UserAddress{}).Where("id = ? AND user_id = ?", id, userID).Update("is_default", true).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// FindAllUsers returns paginated users filtered by role
func (r *Repository) FindAllUsers(role string, offset, limit int, search string) ([]User, int64, error) {
	var users []User
	var total int64

	query := r.db.Model(&User{}).Where("deleted_at IS NULL")

	if role != "" {
		query = query.Where("role = ?", role)
	}

	if search != "" {
		query = query.Where("name ILIKE ? OR email ILIKE ? OR phone ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)

	err := query.Preload("Addresses").
		Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&users).Error

	return users, total, err
}
