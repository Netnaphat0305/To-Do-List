package routes

import (
    "backend/internal/app/controller"
    "backend/internal/app/repository"
    "backend/internal/service"
    "backend/internal/middlewares"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
    repo := repository.NewTaskRepository(db)
    svc := service.NewTaskService(repo)
    ctrl := controller.NewTodoController(svc)


    r.Use(middlewares.CORSMiddleware())

    api := r.Group("/api/v1")
    {
        api.GET("/tasks", ctrl.List)
        api.POST("/tasks", ctrl.Create)
        api.PATCH("/tasks/:id/toggle", ctrl.ToggleStatus)
    }
    
}