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
  config_path = "~/.kube/config"
  insecure    = true
}