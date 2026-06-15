package booking

type CreateBookingRequest struct {
	OutfitID        string  `json:"outfit_id" validate:"required"`
	PickupDate      string  `json:"pickup_date" validate:"required"` // YYYY-MM-DD
	ReturnDate      string  `json:"return_date" validate:"required"` // YYYY-MM-DD
	SizeSelected    string  `json:"size_selected" validate:"required"`
	DeliveryType    string  `json:"delivery_type" validate:"required,oneof=pickup delivery"`
	DeliveryAddress *string `json:"delivery_address"`
}

type UpdateBookingStatusRequest struct {
	Status string `json:"status" validate:"required"`
}

type CancelBookingRequest struct {
	Reason string `json:"reason" validate:"required"`
}
