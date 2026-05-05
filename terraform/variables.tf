variable "image_tag" {
  description = "Docker image tag from Jenkins build number"
  type        = string
  default     = "latest"
}

variable "namespace" {
  type    = string
  default = "todo-app"
}