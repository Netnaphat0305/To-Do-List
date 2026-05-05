package service // หรือชื่อโฟลเดอร์ที่คุณวางไฟล์ไว้

import (
	"backend/internal/app/dto"
	"backend/internal/app/entity"
	"backend/internal/app/repository"
	"errors"
)

type TaskService interface {
	AddTask(req dto.TaskRequest) error
	ListTasks() ([]dto.TaskResponse, error)
	ToggleTaskStatus(id uint) error
	DeleteTask(id uint) error
	GetMetrics() (map[string]interface{}, error)
}

type taskService struct {
	repo repository.TaskRepository
}

func NewTaskService(repo repository.TaskRepository) TaskService {
	return &taskService{repo: repo}
}

func (s *taskService) AddTask(req dto.TaskRequest) error {
	if req.Title == "" {
		return errors.New("หัวข้อห้ามว่าง")
	}
	task := entity.Task{
		Title:       req.Title,
		Description: req.Description,
	}
	return s.repo.Create(&task)
}

func (s *taskService) ListTasks() ([]dto.TaskResponse, error) {
	tasks, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	var res []dto.TaskResponse
	for _, t := range tasks {
		res = append(res, dto.TaskResponse{
			ID:          t.ID,
			Title:       t.Title,
			Description: t.Description,
			Status:      t.Status,
			CreatedAt:   t.CreatedAt,
		})
	}
	return res, nil
}

func (s *taskService) ToggleTaskStatus(id uint) error {
    // 1. ไปดึงงานปัจจุบันมาจาก Repository ก่อน
    task, err := s.repo.GetByID(id)
    if err != nil {
        return err
    }

    // 2. เช็คสถานะแล้วสลับข้าง
    if task.Status == "completed" {
        task.Status = "pending"
    } else {
        task.Status = "completed"
    }

    // 3. สั่ง Repository บันทึกค่าที่สลับแล้วลง Database
    return s.repo.Update(task)
}

func (s *taskService) DeleteTask(id uint) error {
	return s.repo.Delete(id)
}

func (s *taskService) GetMetrics() (map[string]interface{}, error) {
	// สมมติว่าเรามีฟังก์ชันใน Repository ที่ดึงข้อมูลเมตริกส์มา
	return s.repo.GetMetrics()
}