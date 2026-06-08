package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/kloset/backend/internal/booking"
	"github.com/kloset/backend/internal/config"
	"github.com/kloset/backend/internal/database"
	"github.com/kloset/backend/internal/email"
	"github.com/kloset/backend/internal/logging"
	"github.com/kloset/backend/internal/notification"
	"github.com/kloset/backend/internal/outfit"
	"github.com/kloset/backend/internal/payment"
	"github.com/kloset/backend/internal/review"
	"github.com/kloset/backend/internal/support"
	"github.com/kloset/backend/internal/user"
	"github.com/kloset/backend/pkg/utils"
	"github.com/lib/pq"
	"github.com/rs/zerolog/log"
)

func stringPtr(s string) *string {
	return &s
}

func timePtr(t time.Time) *time.Time {
	return &t
}

func main() {
	log.Info().Msg("🌱 Starting Kloset Database Seeding...")

	// 1. Load config and connect to DB
	cfg := config.Load()
	db, err := database.ConnectPostgres(&cfg.DB)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to database for seeding")
	}

	// Run auto-migrations in seeder to ensure tables exist before truncation
	log.Info().Msg("Running auto-migrations in seeder...")
	_ = db.AutoMigrate(
		&notification.Notification{},
		&support.SupportTicket{},
		&logging.SystemLog{},
		&email.EmailLog{},
	)

	// 2. Truncate existing tables to start fresh
	log.Info().Msg("Truncating existing tables...")
	err = db.Exec(`TRUNCATE TABLE 
		users, 
		user_addresses, 
		outfits, 
		outfit_images, 
		wishlists, 
		bookings, 
		transactions, 
		support_tickets, 
		reviews, 
		notifications, 
		email_logs, 
		system_logs 
		CASCADE`).Error
	if err != nil {
		log.Warn().Err(err).Msg("Truncation warning (some tables may not exist yet)")
	}

	// 3. Define pre-hashed static password
	rawPassword := "KlosetSecured123!"
	hashedPassword, err := utils.HashPassword(rawPassword)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to hash seeder password")
	}

	// Define fixed UUIDs for consistency
	adminUUID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
	seller1UUID := uuid.MustParse("00000000-0000-0000-0000-000000000002")
	seller2UUID := uuid.MustParse("00000000-0000-0000-0000-000000000003")
	renter1UUID := uuid.MustParse("00000000-0000-0000-0000-000000000004")
	renter2UUID := uuid.MustParse("00000000-0000-0000-0000-000000000005")

	// 4. Seed Users
	log.Info().Msg("Seeding demo accounts...")
	avatarAdmin := "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
	avatarAnika := "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
	avatarRohit := "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
	avatarSwetha := "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
	avatarAditya := "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"

	users := []user.User{
		{
			ID:            adminUUID,
			Name:          "Kloset Admin",
			Email:         "admin@kloset.in",
			Phone:         "+919999999991",
			PasswordHash:  hashedPassword,
			Role:          "admin",
			AvatarURL:     &avatarAdmin,
			IsActive:      true,
			IsVerified:    true,
			KYCStatus:     "verified",
			WalletBalance: 100000.00,
			TrustScore:    100,
		},
		{
			ID:            seller1UUID,
			Name:          "Anika Sharma",
			Email:         "seller.anika@kloset.in",
			Phone:         "+919999999992",
			PasswordHash:  hashedPassword,
			Role:          "seller",
			AvatarURL:     &avatarAnika,
			IsActive:      true,
			IsVerified:    true,
			KYCStatus:     "verified",
			WalletBalance: 32000.00,
			TrustScore:    98,
		},
		{
			ID:            seller2UUID,
			Name:          "Rohit Mehta",
			Email:         "seller.rohit@kloset.in",
			Phone:         "+919999999993",
			PasswordHash:  hashedPassword,
			Role:          "seller",
			AvatarURL:     &avatarRohit,
			IsActive:      true,
			IsVerified:    true,
			KYCStatus:     "verified",
			WalletBalance: 15400.00,
			TrustScore:    95,
		},
		{
			ID:            renter1UUID,
			Name:          "Swetha Rao",
			Email:         "renter.swetha@kloset.in",
			Phone:         "+919999999994",
			PasswordHash:  hashedPassword,
			Role:          "renter",
			AvatarURL:     &avatarSwetha,
			IsActive:      true,
			IsVerified:    true,
			KYCStatus:     "verified",
			WalletBalance: 25000.00,
			TrustScore:    100,
		},
		{
			ID:            renter2UUID,
			Name:          "Aditya Sen",
			Email:         "renter.aditya@kloset.in",
			Phone:         "+919999999995",
			PasswordHash:  hashedPassword,
			Role:          "renter",
			AvatarURL:     &avatarAditya,
			IsActive:      true,
			IsVerified:    true,
			KYCStatus:     "verified",
			WalletBalance: 18000.00,
			TrustScore:    97,
		},
	}

	for _, u := range users {
		if err := db.Create(&u).Error; err != nil {
			log.Fatal().Err(err).Str("email", u.Email).Msg("Failed to seed user")
		}
	}

	// 5. Seed Addresses
	log.Info().Msg("Seeding user addresses...")
	addresses := []user.UserAddress{
		{
			ID:          uuid.New(),
			UserID:      renter1UUID,
			Label:       "Home",
			FullAddress: "Apt 402, Golden Crest, Linking Road, Santacruz West",
			City:        "Mumbai",
			State:       "Maharashtra",
			Pincode:     "400054",
			IsDefault:   true,
		},
		{
			ID:          uuid.New(),
			UserID:      renter2UUID,
			Label:       "Office",
			FullAddress: "Tower B, Cyber City, Sector 24",
			City:        "Gurugram",
			State:       "Haryana",
			Pincode:     "122002",
			IsDefault:   true,
		},
	}

	for _, addr := range addresses {
		if err := db.Create(&addr).Error; err != nil {
			log.Fatal().Err(err).Msg("Failed to seed address")
		}
	}

	// 6. Seed Outfits
	log.Info().Msg("Seeding outfits catalog...")
	desc1 := "Pre-loved classic maroon bridal lehenga designed with heavy zardozi embroidery and custom silk details. Professionally cleaned."
	desc2 := "Stunning pastel pink sherwani featuring elegant hand-woven embroidery, perfect for wedding ceremonies."
	desc3 := "Traditional Banarasi silk saree in royal blue shade with intricate golden brocade border work."
	desc4 := "Exquisite floor-length emerald green gown by Tarun Tahiliani, styled with subtle sequins and net detailing."

	p1_1 := 3500.00
	p1_3 := 9000.00
	p1_7 := 18000.00
	dep1 := 15000.00

	p2_1 := 4000.00
	p2_3 := 11000.00
	p2_7 := 22000.00
	dep2 := 20000.00

	p3_1 := 2500.00
	p3_3 := 7000.00
	p3_7 := 14000.00
	dep3 := 10000.00

	p4_1 := 4500.00
	p4_3 := 12500.00
	p4_7 := 25000.00
	dep4 := 25000.00

	outfit1UUID := uuid.MustParse("10000000-0000-0000-0000-000000000001")
	outfit2UUID := uuid.MustParse("10000000-0000-0000-0000-000000000002")
	outfit3UUID := uuid.MustParse("10000000-0000-0000-0000-000000000003")
	outfit4UUID := uuid.MustParse("10000000-0000-0000-0000-000000000004")

	outfits := []outfit.Outfit{
		{
			ID:                outfit1UUID,
			SellerID:          seller1UUID,
			Title:             "Sabyasachi Royal Maroon Lehenga",
			Slug:              "sabyasachi-royal-maroon-lehenga",
			Description:       &desc1,
			Category:          "lehenga",
			Occasions:         pq.StringArray{"Wedding", "Reception", "Sangeet"},
			Colors:            pq.StringArray{"Maroon", "Gold"},
			Fabric:            stringPtr("Raw Silk"),
			Sizes:             pq.StringArray{"M", "L"},
			Price1Day:         &p1_1,
			Price3Day:         &p1_3,
			Price7Day:         &p1_7,
			SecurityDeposit:   &dep1,
			DeliveryAvailable: true,
			DeliveryFee:       250.00,
			Status:            "active",
			City:              stringPtr("Mumbai"),
			State:             stringPtr("Maharashtra"),
			Pincode:           stringPtr("400054"),
			RatingAvg:         4.85,
			RatingCount:       12,
			ViewCount:         142,
		},
		{
			ID:                outfit2UUID,
			SellerID:          seller2UUID,
			Title:             "Anita Dongre Pastel Sherwani",
			Slug:              "anita-dongre-pastel-sherwani",
			Description:       &desc2,
			Category:          "sherwani",
			Occasions:         pq.StringArray{"Wedding", "Groomswear"},
			Colors:            pq.StringArray{"Pink", "Ivory"},
			Fabric:            stringPtr("Silk Jamdani"),
			Sizes:             pq.StringArray{"L", "XL"},
			Price1Day:         &p2_1,
			Price3Day:         &p2_3,
			Price7Day:         &p2_7,
			SecurityDeposit:   &dep2,
			DeliveryAvailable: true,
			DeliveryFee:       300.00,
			Status:            "active",
			City:              stringPtr("Delhi"),
			State:             stringPtr("Delhi"),
			Pincode:           stringPtr("110001"),
			RatingAvg:         5.00,
			RatingCount:       1,
			ViewCount:         89,
		},
		{
			ID:                outfit3UUID,
			SellerID:          seller1UUID,
			Title:             "Raw Mango Banarasi Silk Saree",
			Slug:              "raw-mango-banarasi-silk-saree",
			Description:       &desc3,
			Category:          "saree",
			Occasions:         pq.StringArray{"Diwali", "Festive", "Sangeet"},
			Colors:            pq.StringArray{"Blue", "Gold"},
			Fabric:            stringPtr("Banarasi Silk"),
			Sizes:             pq.StringArray{"Free Size"},
			Price1Day:         &p3_1,
			Price3Day:         &p3_3,
			Price7Day:         &p3_7,
			SecurityDeposit:   &dep3,
			DeliveryAvailable: false,
			Status:            "active",
			City:              stringPtr("Mumbai"),
			State:             stringPtr("Maharashtra"),
			Pincode:           stringPtr("400050"),
			RatingAvg:         0.00,
			RatingCount:       0,
			ViewCount:         47,
		},
		{
			ID:                outfit4UUID,
			SellerID:          seller2UUID,
			Title:             "Tarun Tahiliani Sequined Gown",
			Slug:              "tarun-tahiliani-sequined-gown",
			Description:       &desc4,
			Category:          "gown",
			Occasions:         pq.StringArray{"Reception", "Cocktail"},
			Colors:            pq.StringArray{"Green"},
			Fabric:            stringPtr("Net & Georgette"),
			Sizes:             pq.StringArray{"S", "M"},
			Price1Day:         &p4_1,
			Price3Day:         &p4_3,
			Price7Day:         &p4_7,
			SecurityDeposit:   &dep4,
			DeliveryAvailable: true,
			DeliveryFee:       400.00,
			Status:            "active",
			City:              stringPtr("Jaipur"),
			State:             stringPtr("Rajasthan"),
			Pincode:           stringPtr("302001"),
			RatingAvg:         0.00,
			RatingCount:       0,
			ViewCount:         65,
		},
	}

	for _, o := range outfits {
		if err := db.Create(&o).Error; err != nil {
			log.Fatal().Err(err).Str("title", o.Title).Msg("Failed to seed outfit")
		}
	}

	// 7. Seed Outfit Images
	log.Info().Msg("Seeding outfit media items...")
	images := []outfit.OutfitImage{
		{
			ID:        uuid.New(),
			OutfitID:  outfit1UUID,
			URL:       "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
			IsPrimary: true,
			SortOrder: 0,
		},
		{
			ID:        uuid.New(),
			OutfitID:  outfit2UUID,
			URL:       "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800",
			IsPrimary: true,
			SortOrder: 0,
		},
		{
			ID:        uuid.New(),
			OutfitID:  outfit3UUID,
			URL:       "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
			IsPrimary: true,
			SortOrder: 0,
		},
		{
			ID:        uuid.New(),
			OutfitID:  outfit4UUID,
			URL:       "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
			IsPrimary: true,
			SortOrder: 0,
		},
	}

	for _, img := range images {
		if err := db.Create(&img).Error; err != nil {
			log.Fatal().Err(err).Msg("Failed to seed outfit image")
		}
	}

	// 8. Seed Bookings
	log.Info().Msg("Seeding sample bookings...")
	booking1UUID := uuid.MustParse("20000000-0000-0000-0000-000000000001")
	booking2UUID := uuid.MustParse("20000000-0000-0000-0000-000000000002")
	booking3UUID := uuid.MustParse("20000000-0000-0000-0000-000000000003")

	now := time.Now()
	deadline1 := now.Add(24 * time.Hour)
	deadline3 := now.Add(48 * time.Hour)

	bookings := []booking.Booking{
		{
			ID:                   booking1UUID,
			BookingRef:           "KL-2026-102941",
			OutfitID:             outfit1UUID,
			RenterID:             renter1UUID,
			SellerID:             seller1UUID,
			PickupDate:           now.AddDate(0, 0, 1),
			ReturnDate:           now.AddDate(0, 0, 4),
			RentalDays:           3,
			SizeSelected:         "M",
			Status:               "confirmed",
			DeliveryType:         "delivery",
			RentalAmount:         9000.00,
			SecurityDeposit:      15000.00,
			DeliveryFee:          250.00,
			PlatformFee:          450.00,
			TotalAmount:          24700.00,
			PaymentStatus:        "completed",
			RazorpayOrderID:      stringPtr("order_seeding_booking_1"),
			RazorpayPaymentID:    stringPtr("pay_seeding_booking_1"),
			SellerAcceptedAt:     &now,
			SellerAcceptDeadline: &deadline1,
			CreatedAt:            now.AddDate(0, 0, -2),
		},
		{
			ID:                   booking2UUID,
			BookingRef:           "KL-2026-108420",
			OutfitID:             outfit2UUID,
			RenterID:             renter2UUID,
			SellerID:             seller2UUID,
			PickupDate:           now.AddDate(0, 0, -10),
			ReturnDate:           now.AddDate(0, 0, -7),
			RentalDays:           3,
			SizeSelected:         "L",
			Status:               "completed",
			DeliveryType:         "delivery",
			RentalAmount:         11000.00,
			SecurityDeposit:      20000.00,
			DeliveryFee:          300.00,
			PlatformFee:          550.00,
			TotalAmount:          31850.00,
			PaymentStatus:        "completed",
			RazorpayOrderID:      stringPtr("order_seeding_booking_2"),
			RazorpayPaymentID:    stringPtr("pay_seeding_booking_2"),
			SellerAcceptedAt:     &now,
			ReturnedAt:           timePtr(now.AddDate(0, 0, -7)),
			CreatedAt:            now.AddDate(0, 0, -12),
		},
		{
			ID:                   booking3UUID,
			BookingRef:           "KL-2026-105230",
			OutfitID:             outfit3UUID,
			RenterID:             renter1UUID,
			SellerID:             seller1UUID,
			PickupDate:           now.AddDate(0, 0, 7),
			ReturnDate:           now.AddDate(0, 0, 10),
			RentalDays:           3,
			SizeSelected:         "Free Size",
			Status:               "pending",
			DeliveryType:         "pickup",
			RentalAmount:         7000.00,
			SecurityDeposit:      10000.00,
			DeliveryFee:          0.00,
			PlatformFee:          350.00,
			TotalAmount:          17350.00,
			PaymentStatus:        "pending",
			RazorpayOrderID:      stringPtr("order_seeding_booking_3"),
			SellerAcceptDeadline: &deadline3,
			CreatedAt:            now,
		},
	}

	for _, b := range bookings {
		if err := db.Create(&b).Error; err != nil {
			log.Fatal().Err(err).Str("ref", b.BookingRef).Msg("Failed to seed booking")
		}
	}

	// 9. Seed Transactions
	log.Info().Msg("Seeding payment transactions...")
	gw := "razorpay"
	note1 := "Paid rental order via Razorpay"
	note2 := "Paid rental order via Razorpay (returned)"

	txs := []payment.Transaction{
		{
			ID:           uuid.New(),
			UserID:       renter1UUID,
			BookingID:    &booking1UUID,
			Type:         "rental_payment",
			Amount:       24700.00,
			Status:       "completed",
			Gateway:      &gw,
			GatewayTxnID: stringPtr("pay_seeding_booking_1"),
			Note:         &note1,
			CreatedAt:    now.AddDate(0, 0, -2),
		},
		{
			ID:           uuid.New(),
			UserID:       renter2UUID,
			BookingID:    &booking2UUID,
			Type:         "rental_payment",
			Amount:       31850.00,
			Status:       "completed",
			Gateway:      &gw,
			GatewayTxnID: stringPtr("pay_seeding_booking_2"),
			Note:         &note2,
			CreatedAt:    now.AddDate(0, 0, -12),
		},
	}

	for _, t := range txs {
		if err := db.Create(&t).Error; err != nil {
			log.Fatal().Err(err).Msg("Failed to seed transaction")
		}
	}

	// 10. Seed Support Tickets
	log.Info().Msg("Seeding support tickets...")
	tickets := []support.SupportTicket{
		{
			ID:          "ticket-seeding-1",
			RenterName:  "Swetha Rao",
			RenterEmail: "renter.swetha@kloset.in",
			Subject:     "Delivery tracking inquiry",
			Description: "My booking B-102941 starts tomorrow. Just wanted to check if the lehenga has been shipped and get tracking details.",
			Priority:    "medium",
			Status:      "open",
			CreatedAt:   now.Add(-2 * time.Hour),
		},
		{
			ID:          "ticket-seeding-2",
			RenterName:  "Aditya Sen",
			RenterEmail: "renter.aditya@kloset.in",
			Subject:     "Security deposit refund status",
			Description: "I returned the Anita Dongre pastel sherwani 3 days ago. The seller confirmed they received it. When will my security deposit of ₹20,000 be refunded to my wallet?",
			Priority:    "high",
			Status:      "open",
			CreatedAt:   now.Add(-24 * time.Hour),
		},
	}

	for _, t := range tickets {
		if err := db.Create(&t).Error; err != nil {
			log.Fatal().Err(err).Str("subject", t.Subject).Msg("Failed to seed support ticket")
		}
	}

	// 11. Seed Reviews
	log.Info().Msg("Seeding ratings and reviews...")
	comm := "Elegant pastel Pink Sherwani from Anita Dongre. Received many compliments, and the quality was impeccable. The host dry-cleaned it perfectly."
	revs := []review.Review{
		{
			ID:         uuid.New(),
			BookingID:  booking2UUID,
			ReviewerID: renter2UUID,
			OutfitID:   outfit2UUID,
			SellerID:   seller2UUID,
			Rating:     5,
			Comment:    &comm,
			IsVisible:  true,
			CreatedAt:  now.AddDate(0, 0, -6),
		},
	}

	for _, r := range revs {
		if err := db.Create(&r).Error; err != nil {
			log.Fatal().Err(err).Msg("Failed to seed review")
		}
	}

	log.Info().Msg("🎉 Kloset Database Seeding Complete! Enjoy testing!")
	fmt.Printf("\nDemo Login Accounts:\n")
	fmt.Printf("====================\n")
	fmt.Printf("Admin:  admin@kloset.in / %s\n", rawPassword)
	fmt.Printf("Seller: seller.anika@kloset.in / %s\n", rawPassword)
	fmt.Printf("Seller: seller.rohit@kloset.in / %s\n", rawPassword)
	fmt.Printf("Renter: renter.swetha@kloset.in / %s\n", rawPassword)
	fmt.Printf("Renter: renter.aditya@kloset.in / %s\n", rawPassword)
}
