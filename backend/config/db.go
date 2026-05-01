package config

import (
	"fmt"
	"os"
	"backend/internal/app/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"backend/config/seed"
	"log"
)

var DB *gorm.DB

func ConnectDatabase() {
	// ดึงค่าจาก .env ที่คุณโหลดไว้ใน main
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Bangkok",
		dbHost, dbUser, dbPass, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	// สั่งให้ GORM สร้างตารางตาม Entity ที่เราเขียน
	db.AutoMigrate(&entity.Task{})

	DB = db
	fmt.Println("Database connection established and migrated.")

	// 1. Migrate (สร้างตาราง)
    db.AutoMigrate(&entity.Task{})

    // 2. เรียก Seed (เรียกใช้ package seed ที่สร้างไว้)
    seed.SeedTasks(db)

    DB = db
    log.Println("Database connection established and seeded.")
}