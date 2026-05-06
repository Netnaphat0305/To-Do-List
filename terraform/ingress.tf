resource "kubernetes_ingress_v1" "todo_ingress" {
  metadata {
    name      = "todo-ingress"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
    annotations = {
      # ระบุให้ใช้ NGINX Ingress Controller
      "kubernetes.io/ingress.class" = "nginx"
      # แก้ไขเป็น /$2 เพื่อให้มันดึงส่วนที่เหลือของ path มาใช้ครับ
      "nginx.ingress.kubernetes.io/rewrite-target" = "/$2"
    }
  }

  spec {
    rule {
      # ชื่อ Domain ที่ต้องการใช้เข้าเว็บ
      host = "todo.local"
      http {
        path {
          path = "/()(.*)" 
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.todo_frontend_service.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
        # 2. เพิ่ม Path ใหม่สำหรับ Grafana (เพิ่มตรงนี้ครับ)
        path {
          path = "/prometheus(/|$)(.*)"
          path_type = "Prefix"
          backend {
            service {
              name = "prometheus-service"
              port { number = 9090 }
            }
          }
        }
        # 3. แก้ไข Path Grafana เป็นแบบนี้ครับ
        path {
          path = "/grafana(/|$)(.*)"
          path_type = "Prefix"
          backend {
            service {
              name = "grafana-service"
              port { number = 3000 }
            }
          }
        }
      }
    }
  }
}