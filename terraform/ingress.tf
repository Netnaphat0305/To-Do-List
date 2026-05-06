resource "kubernetes_ingress_v1" "todo_ingress" {
  metadata {
    name      = "todo-ingress"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
    annotations = {
      # ระบุให้ใช้ NGINX Ingress Controller
      "kubernetes.io/ingress.class" = "nginx"
    }
  }

  spec {
    rule {
      # ชื่อ Domain ที่ต้องการใช้เข้าเว็บ
      host = "todo.local"
      http {
        path {
          path = "/"
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
          path = "/grafana"
          path_type = "Prefix"
          backend {
            service {
              # ใส่ชื่อ Service ของ Grafana ให้ตรงกับที่คุณประกาศไว้ใน k8s
              name = "grafana-service" 
              port {
                number = 3000
              }
            }
          }
        }
        # 3. เพิ่ม Path สำหรับ Prometheus (เพื่อให้เข้า localhost:9090 ได้อัตโนมัติ)
        path {
          path = "/prometheus"
          path_type = "Prefix"
          backend {
            service {
              name = "prometheus-service" # เช็คชื่อ Service ในไฟล์ k8s ของคุณว่าชื่อนี้ไหม
              port {
                number = 9090
              }
            }
          }
        }
      }
    }
  }
}