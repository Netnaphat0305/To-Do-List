package dto

import "time"

// TaskRequest: ข้อมูลที่รับจากหน้า To-do (Neo-brutalism)
type TaskRequest struct {
    Title       string `json:"title" binding:"required"`
    Description string `json:"description"`
    DueDate     string `json:"due_date"` // รับเป็น string "2026-05-01" แล้วค่อย Parse ใน Service
}

// TaskResponse: ข้อมูลที่จะส่งกลับไปโชว์ที่หน้าเว็บ
type TaskResponse struct {
    ID          uint      `json:"id"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Status      string    `json:"status"`
    DueDate     *time.Time `json:"due_date"`
    CreatedAt   time.Time `json:"created_at"`
}