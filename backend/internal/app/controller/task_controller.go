package controller

import (
	"net/http"
	"backend/internal/service" 
	"github.com/gin-gonic/gin"
	"backend/internal/app/dto"
	"strconv"
)

type TodoController struct {
	svc service.TaskService // เรียกใช้ Interface จาก Service Layer
}

func NewTodoController(svc service.TaskService) *TodoController {
	return &TodoController{svc: svc}
}

func (ctrl *TodoController) Create(c *gin.Context) {
    var req dto.TaskRequest // ใช้ DTO ตามสไตล์ Clean Architecture
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
        return
    }

    // แก้ไขจาก (req.Title, req.Description) เป็นส่ง req เข้าไปทั้งก้อน
    if err := ctrl.svc.AddTask(req); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "สร้างรายการสำเร็จ"})
}

func (ctrl *TodoController) List(c *gin.Context) {
	tasks, err := ctrl.svc.ListTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func (ctrl *TodoController) ToggleStatus(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    
    // เรียกใช้ ToggleTaskStatus แทน MarkDone
    if err := ctrl.svc.ToggleTaskStatus(uint(id)); err != nil {
        c.JSON(500, gin.H{"error": "ไม่สามารถสลับสถานะได้"})
        return
    }
    
    c.JSON(200, gin.H{"message": "สลับสถานะงานเรียบร้อยแล้ว"})
}

func (ctrl *TodoController) Delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    
    if err := ctrl.svc.DeleteTask(uint(id)); err != nil {
        c.JSON(500, gin.H{"error": "ไม่สามารถลบงานได้"})
        return
    }
    
    c.JSON(200, gin.H{"message": "ลบงานเรียบร้อยแล้ว"})
}