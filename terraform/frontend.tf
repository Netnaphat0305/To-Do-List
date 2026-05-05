resource "kubernetes_deployment" "todo_frontend" {
  metadata {
    name      = "todo-frontend"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "todo-frontend"
      }
    }
    template {
      metadata {
        labels = {
          app = "todo-frontend"
        }
      }
      spec {
        container {
          name  = "todo-frontend"
          image = "nattasitfluk/todo-frontend:${var.image_tag}"

          image_pull_policy = "Alway
          port {
            container_port = 3000
          }
          env {
            name  = "BACKEND_URL"
            value = "http://todo-backend-service:80/api/v1"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "todo_frontend_service" {
  metadata {
    name      = "todo-frontend-service"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
  }
  spec {
    selector = {
      app = "todo-frontend"
    }
    port {
      port        = 80
      target_port = 3000
      # แก้จุดที่ 3: กำหนดเลข Port สำหรับเข้าเว็บ (เลือกเลขระหว่าง 30000-32767)
      node_port   = 30005
    }
    type = "ClusterIP"
  }
}