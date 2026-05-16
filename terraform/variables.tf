#กำหนดตัวแปร (รับค่าจาก Jenkins)
variable "image_tag" {
  description = "Docker image tag from Jenkins build number"
  type        = string
  default     = "latest"
}

variable "namespace" {
  type    = string
  default = "todo-app"
}

variable "db_password" {
  type      = string
  sensitive = true
}