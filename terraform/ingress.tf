#สร้าง Ingress (Traffic Router)
resource "kubernetes_ingress_v1" "todo_ingress" {
  metadata {
    name      = "todo-ingress"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      # ลบ rewrite-target อันเก่าออก แล้วใช้บรรทัดล่างนี้แทนครับ
      "nginx.ingress.kubernetes.io/configuration-snippet" = <<EOF
        if ($request_uri ~* "/prometheus/(.*)") {
            rewrite ^/prometheus/(.*) /$1 break;
        }
      EOF
    }
  }

  spec {
    rule {
      host = "todo.local"
      http {
        # 1. Frontend (ไม่ต้องแก้)
        path {
          path = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.todo_frontend_service.metadata[0].name
              port { number = 80 }
            }
          }
        }
        # 2. Grafana (ไม่ต้องแก้)
        path {
          path = "/grafana"
          path_type = "Prefix"
          backend {
            service {
              name = "grafana-service"
              port { number = 3000 }
            }
          }
        }
        # 3. Prometheus (ใช้ path ปกติ)
        path {
          path = "/prometheus"
          path_type = "Prefix"
          backend {
            service {
              name = "prometheus-service"
              port { number = 9090 }
            }
          }
        }
      }
    }
  }
}