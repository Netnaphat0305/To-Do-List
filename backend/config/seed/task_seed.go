package seed

import (
    "backend/internal/app/entity"
    "gorm.io/gorm"
    "log"
)

func SeedTasks(db *gorm.DB) {
    tasks := []entity.Task{
        {
            Title:       "Setup Cloud Infrastructure",
            Description: "เตรียม Docker และ Jenkins สำหรับ Phase 2",
            Status:      "pending",
        },
        {
            Title:       "Implement Clean Architecture",
            Description: "แยก Layer Controller, Service, Repository ให้สมบูรณ์",
            Status:      "completed",
        },
        {
            Title:       "Database Migration",
            Description: "จัดการ Schema และ Seed ข้อมูลเริ่มต้น",
            Status:      "completed",
        },
    }

    for i := range tasks {
        // ใช้ FirstOrCreate เพื่อไม่ให้ข้อมูลซ้ำเวลา Restart Server เหมือนโปรเจกต์เดิม
        if err := db.Where("title = ?", tasks[i].Title).
            FirstOrCreate(&tasks[i]).Error; err != nil {
            log.Printf("Error seeding task %s: %v", tasks[i].Title, err)
        }
    }

    log.Println("Seed Tasks Completed!")
}