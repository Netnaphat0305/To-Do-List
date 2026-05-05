resource "kubernetes_namespace" "todo_app" {
  metadata {
    name = var.namespace
  }
}