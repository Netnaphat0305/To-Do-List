package main

import (
	"backend/config"
	"backend/internal/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv" 
	"log"
)

const PORT = "8080"

func main() {
	// โหลดไฟล์ .env ก่อนเพื่อนเลย
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	// 1. ต่อ DB และ Migrate
	config.ConnectDatabase()

	// 2. ตั้งค่า Gin
	r := gin.Default()

	// 3. ให้ Routes จัดการ URL ทั้งหมด
	routes.SetupRoutes(r, config.DB)

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// 4. รัน Server
	r.Run(":" + PORT)

}
