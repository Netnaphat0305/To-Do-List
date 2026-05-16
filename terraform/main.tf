#สร้าง Namespace + Secret
resource "kubernetes_namespace" "todo_app" {
  metadata {
    name = var.namespace
  }
}
resource "kubernetes_secret" "postgres_secret" {
  metadata {
    name      = "postgres-secret"
    namespace = kubernetes_namespace.todo_app.metadata[0].name
  }

  data = {
    password = var.db_password # รหัสผ่านที่ส่งมาจาก Jenkins จะถูกมาเก็บไว้ที่นี่
  }
}