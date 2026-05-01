package repository

import (
	"backend/internal/app/entity"
	"gorm.io/gorm"
)

type TaskRepository interface {
	Create(task *entity.Task) error
	GetAll() ([]entity.Task, error)
	GetByID(id uint) (*entity.Task, error)
	Update(task *entity.Task) error
	Delete(id uint) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(task *entity.Task) error {
	return r.db.Create(task).Error
}

func (r *taskRepository) GetAll() ([]entity.Task, error) {
	var tasks []entity.Task
	err := r.db.Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) GetByID(id uint) (*entity.Task, error) {
    var task entity.Task
    if err := r.db.First(&task, id).Error; err != nil {
        return nil, err
    }
    return &task, nil
}

func (r *taskRepository) Update(task *entity.Task) error {
    return r.db.Save(task).Error
}

func (r *taskRepository) Delete(id uint) error {
	return r.db.Delete(&entity.Task{}, id).Error
}