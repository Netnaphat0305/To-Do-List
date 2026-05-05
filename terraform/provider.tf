terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23.0"
    }
  }
}

provider "kubernetes" {
  # อ่านค่าจาก ~/.kube/config เหมือน kubectl
  # ถ้า Jenkins รันบนเครื่องที่มีสิทธิ์ kubectl อยู่แล้ว จะใช้งานได้ทันที
  config_path = "~/.kube/config"
}