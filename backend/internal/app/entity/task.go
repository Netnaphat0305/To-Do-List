package entity

import (
	"time"
	"gorm.io/gorm"
)


type Task struct {
    gorm.Model

    // Title คือชื่อของงาน (To-Do)
    Title       string    `gorm:"type:varchar(255);not null" json:"title"`
    
    // Status เก็บสถานะ เช่น 'pending' หรือ 'completed'
    Status      string    `gorm:"type:varchar(50);default:'pending'" json:"status"`
    Description string    `gorm:"type:text" json:"description"`
    // DueDate คือวันที่กำหนดส่งที่คุณต้องการเพิ่มเข้าไป
    // ใช้ pointer *time.Time เพื่อให้ค่าเป็น null ได้ถ้ายังไม่กำหนดวันที่
    DueDate     *time.Time `json:"due_date"` 
    
}