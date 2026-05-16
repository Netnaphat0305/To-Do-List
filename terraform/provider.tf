#บอกว่าจะคุยกับ Kubernetes ยังไง
terraform {
  # Terraform เซฟความจำไว้ที่นี่ 
  backend "local" {
    path = "/var/jenkins_home/todo-app-terraform.tfstate"
  }

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