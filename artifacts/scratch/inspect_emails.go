package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type EmailLog struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	ToEmail   string    `gorm:"size:255;not null;index"`
	Subject   string    `gorm:"size:255;not null"`
	Status    string    `gorm:"size:50;not null;index"`
	Attempts  int       `gorm:"type:integer;not null"`
	LastError *string   `gorm:"type:text"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func main() {
	dsn := "host=localhost user=postgres password=kloset_dev_password dbname=kloset port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	fmt.Println("=== KLOSET EMAIL DIAGNOSTICS INSPECTOR ===")

	// 1. Total Count by Status
	var statusCounts []struct {
		Status string
		Count  int64
	}
	db.Model(&EmailLog{}).Select("status, count(*) as count").Group("status").Scan(&statusCounts)
	fmt.Println("\nStatus Distribution:")
	for _, sc := range statusCounts {
		fmt.Printf(" - %s: %d\n", sc.Status, sc.Count)
	}

	// 2. Failure Causes (LastError)
	var errorsList []struct {
		LastError string
		Count     int64
	}
	db.Model(&EmailLog{}).Where("status = ?", "failed").Select("last_error, count(*) as count").Group("last_error").Scan(&errorsList)
	fmt.Println("\nUnique Error Messages (failed status):")
	for _, el := range errorsList {
		errStr := "nil"
		if el.LastError != "" {
			errStr = el.LastError
		}
		fmt.Printf(" - %s: %d\n", errStr, el.Count)
	}

	// 3. Time Range
	var timeRange struct {
		MinCreatedAt time.Time
		MaxCreatedAt time.Time
	}
	db.Model(&EmailLog{}).Where("status = ?", "failed").Select("min(created_at) as min_created_at, max(created_at) as max_created_at").Scan(&timeRange)
	fmt.Printf("\nFailure Time Range:\n - Earliest: %s\n - Latest: %s\n", timeRange.MinCreatedAt.Format(time.RFC3339), timeRange.MaxCreatedAt.Format(time.RFC3339))

	// 4. Email Types Affected (by Subject / Type indicator)
	var subjectsList []struct {
		Subject string
		Count   int64
	}
	db.Model(&EmailLog{}).Where("status = ?", "failed").Select("subject, count(*) as count").Group("subject").Scan(&subjectsList)
	fmt.Println("\nAffected Email Types:")
	for _, sl := range subjectsList {
		fmt.Printf(" - %s: %d\n", sl.Subject, sl.Count)
	}

	// 5. Attempts Distribution
	var attemptsCounts []struct {
		Attempts int
		Count    int64
	}
	db.Model(&EmailLog{}).Where("status = ?", "failed").Select("attempts, count(*) as count").Group("attempts").Scan(&attemptsCounts)
	fmt.Println("\nAttempts Distribution (failed status):")
	for _, ac := range attemptsCounts {
		fmt.Printf(" - %d attempt(s): %d\n", ac.Attempts, ac.Count)
	}
}
