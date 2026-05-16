#สร้าง Backend Pod + Service
resource "kubernetes_deployment" "todo_backend" {
  metadata {
    name      = "todo-backend"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "todo-backend"
      }
    }
    template {
      metadata {
        labels = {
          app = "todo-backend"
        }
      }
      spec {
        container {
          name  = "todo-backend"
          # ใช้ตัวแปรที่รับมาจาก Jenkins
          image = "nattasitfluk/todo-backend:${var.image_tag}"

          image_pull_policy = "Always"
          
          port {
            container_port = 8080
          }
          env {
            name  = "DB_HOST"
            value = "postgres-service"
          }
          env {
            name  = "DB_PORT"
            value = "5432"
          }
          env {
            name  = "DB_NAME"
            value = "todo_db"
          }
          env {
            name  = "DB_USER"
            value = "postgres"
          }
          env {
            name = "DB_PASS"
            value_from {
              secret_key_ref {
                name = "postgres-secret"
                key  = "password"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "todo_backend_service" {
  metadata {
    name      = "todo-backend-service"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
  }
  spec {
    selector = {
      app = "todo-backend"
    }
    port {
      port        = 80
      target_port = 8080
    }
    type = "ClusterIP"
  }
}