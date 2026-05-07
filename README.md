# 🚀 To-Do-List — ENG23 3074

>  เว็ป To-Do-List สำหรับจัดการสิ่งที่ต้องทำ สร้างด้วย Golang และ Node.js รันบน Docker และ Deploy ลงบน Kubernetes โดยอัตโนมัติผ่าน Jenkins Pipeline ควบคุม Infrastructure ด้วย Terraform และมีระบบ Monitoring อย่างครบวงจร

---

## 👥 สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล | ความรับผิดชอบ |
|---|---|---|
| B6608019 | นาวสาวเนตรนภัทร ชำนินอก | Git, App Development |
| B6609023 | นายณัฐสิทธิ์ มามั่น | Jenkins, Docker |
| B6639334 | นางสาวพิมพ์นารา อดุลจันทรศร | Terraform |
| B6643041 | นางสาวพนิดา โต๊ะเหลือ | Kubernetes, Monitoring |

---

## 📌 ภาพรวมโปรเจค

### แอปพลิเคชัน

- **ชื่อ:** To-Do-List ENG23
- **ประเภท:** Full-stack Web Application (Microservices Architecture)
- **ภาษา / Framework:**
  - **Backend:** Golang (Gin Framework)
  - **Frontend:** Node.js (React / Next.js)
  - **Database:** PostgreSQL
- **คำอธิบาย:** เว็บแอปพลิเคชันสำหรับบันทึกและจัดการรายการสิ่งที่ต้องทำ โดยตัวระบบถูกออกแบบให้ทำงานบน Kubernetes Cluster มีระบบ Ingress จัดการ Traffic และมี Monitoring คอยตรวจสอบสถานะของระบบตลอด 24 ชั่วโมง

### Architecture Diagram

```text
        Developer
             │
             ▼  git push
          GitHub ────── Webhook ───────▶ Jenkins (CI/CD Pipeline)
                                            │
    ┌───────────────────────────────────────┴──────────────────────────────────────┐
    ▼               ▼               ▼               ▼               ▼              ▼
 1.Checkout ──▶ 2.Build ──▶ 3.Test ──▶ 4.Docker Build ──▶ 5.Push Hub ──▶ 6.Deploy
 (Pull Source)  (Install Deps) (Unit Test)   (Create Image)  (Docker Hub)  (Terraform + kubectl)
                                                                    │              │
                                                                    ▼              ▼
                                                               Docker Hub ──▶ Kubernetes
                                                                            (todo-app NS)
                                                                           ┌──────────────┐
             ┌────────────── Monitoring ──────────────┐                    │   Ingress    │
             ▼                                        ▼                    │ (todo.local) │
        Prometheus <───────── Scrape ────────── Backend Pod ───────────────┼──▶ Pod       │
     (Metrics/Logs)         (/metrics)         (Go Server)                 │  [Backend]   │
             │                                        │                    │      │       │
             ▼                                        ▼                    │      ▼       │
          Grafana <───────── Visualize ───────── Frontend Pod <────────────┼──▶ PostgreSQL│
        (Dashboard)                            (React/Next.js)             │  (Database)  │
                                                                           └──────────────┘
```

---

## 📁 โครงสร้าง Repository

```text
To-Do-List/
├── backend/                  # ส่วนของ API (Golang)
│   ├── internal/             # Business Logic หลักของระบบ
│   ├── Dockerfile            # สำหรับสร้าง Backend Image
│   ├── go.mod                # ไฟล์จัดการ dependencies ของ Go
│   └── main.go               # Entry point ของแอปพลิเคชัน
├── frontend/                 # ส่วนของ UI (Node.js/React)
│   ├── app.js                # โค้ดหลักของ Frontend
│   ├── Dockerfile            # สำหรับสร้าง Image ของ Frontend
│   └── package.json          # ไฟล์จัดการ dependencies ของ Node.js
├── grafana-data/             # ที่เก็บข้อมูลของ Grafana (Local volume)
├── k8s/                      # Kubernetes Manifests
│   ├── backend/              # แฟ้มเก็บไฟล์ K8s ของ backend
│   ├── frontend/             # แฟ้มเก็บไฟล์ K8s ของ frontend
│   └── monitoring/           # แฟ้มเก็บไฟล์ K8s สำหรับ Monitoring
├── prometheus/               # ไฟล์ตั้งค่าระบบ Monitoring
│   ├── alert_rules.yml       # กฎการแจ้งเตือน (Alerting Rules)
│   └── prometheus.yml        # การตั้งค่า Scrape targets
├── prometheus-data/          # ที่เก็บข้อมูล Time-series ของ Prometheus
├── terraform/                # Infrastructure as Code (จัดการ Resource บน Kubernetes)
│   ├── backend.tf            # จัดการ Deployment/Service ของ Backend
│   ├── database.tf           # จัดการ Deployment/Service/Secret ของ PostgreSQL
│   ├── frontend.tf           # จัดการ Deployment/Service ของ Frontend
│   ├── ingress.tf            # กำหนด Ingress Rules และ Domain Routing
│   ├── main.tf               # กำหนด Namespace และทรัพยากรหลัก
│   └── variables.tf          # กำหนดตัวแปร (เช่น image_tag, db_password)
├── docker-compose.yml        # สำหรับรันระบบทดสอบในเครื่อง (Local)
└── Jenkinsfile               # ไฟล์กำหนด Automation Pipeline (CI/CD)
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

| Tool | Version (Tested) | หน้าที่ |
|---|---|---|
| **Git** | ≥ 2.x | จัดการ Source Code |
| **Docker** | ≥ 24.x | สร้างและจัดการ Container |
| **Jenkins** | ≥ 2.4xx | ระบบ CI/CD Automation |
| **Terraform** | ≥ 1.x | Provision Infrastructure บน Kubernetes |
| **kubectl** | ≥ 1.28 | สั่งงาน Kubernetes Cluster |
| **Prometheus** | Latest | เก็บ Metrics ของระบบ |
| **Grafana** | ≥ 10.x | แสดงผล Dashboard |

---

## 🏃 วิธีรันโปรเจค (Quick Start)

### 1. Clone Repository

```bash
git clone https://github.com/Netnaphat0305/To-Do-List.git
cd To-Do-List
```

### 2. รันแอปบนเครื่องโดยตรง (ไม่ผ่าน pipeline)

```bash
# Backend
cd backend
go mod download
go run main.go
# API รันที่ http://localhost:8080

# Frontend
cd frontend
npm install
npm start
# UI รันที่ http://localhost:3000
```

### 3. Build และรันด้วย Docker

```bash
# รันระบบทั้งหมดในโหมด Background
docker-compose up -d --build
```

> ตรวจสอบสถานะ Container: `docker ps`

### 4. Build Image (สำหรับเตรียม Deploy)

```bash
# Build Backend Image
docker build -t [username]/todo-backend:latest ./backend

# Build Frontend Image
docker build -t [username]/todo-frontend:latest ./frontend
```

---

## 🔄 CI/CD Pipeline (Jenkins)

ไปป์ไลน์จะเริ่มทำงานอัตโนมัติเมื่อมีการ Push ไปที่ Branch `main`

| Stage | คำอธิบาย |
|---|---|
| **1. Checkout** | ดึงโค้ดล่าสุดจาก GitHub |
| **2. Build & Test** | เตรียมเวอร์ชันแอปพลิเคชัน (Image Tag) |
| **3. Docker Build** | สร้าง Image: Frontend และ Backend |
| **4. Test Images** | ตรวจสอบว่า Container รันได้เบื้องต้น |
| **5. Push Hub** | อัปโหลด Image ไปยัง Docker Hub (`nattasitfluk/todo-*`) |
| **6. Deploy** | รัน Terraform เพื่อ Update K8s Resources และ Ingress |

---

## 🏗️ Infrastructure as Code (Terraform)

โปรเจคนี้ใช้ Terraform ในการจัดการทรัพยากรบน Kubernetes โดยแบ่งไฟล์ออกเป็นสัดส่วน (Modular):

- **Database:** สร้าง PostgreSQL Pod พร้อมใช้งาน `Secret` เก็บ Password
- **Backend/Frontend:** จัดการ Deployment (2 Replicas) และ Services
- **Ingress:** จัดการเส้นทางผ่าน `todo.local` เพื่อแยก Traffic ระหว่าง UI, API และ Monitoring

### คำสั่งที่ต้องใช้

```bash
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform plan      # ตรวจสอบว่าจะสร้างอะไรบ้าง
terraform apply     # สร้าง resource จริงบน Kubernetes
```

---

## ☸️ Kubernetes & Ingress

ตั้งค่าไฟล์ `/etc/hosts` (Linux/Mac) หรือ `C:\Windows\System32\drivers\etc\hosts` (Windows):

```text
[K8s_NODE_IP] todo.local
```

| บริการ | URL สำหรับเข้าใช้งาน |
|---|---|
| **Web UI** | http://todo.local/ |
| **Prometheus** | http://todo.local/prometheus |
| **Grafana** | http://todo.local/grafana |

---

## 📊 Monitoring

### Alerting (`alert_rules.yml`)

1. **InstanceDown** — แจ้งเตือนหาก Service ล่มนานกว่า 1 นาที
2. **HighErrorRate** — แจ้งเตือนหาก Backend ตอบกลับเป็น Error 5xx เกิน 5%

### Dashboard (Grafana)

- **Username / Password:** `admin` / `admin`
- แสดงข้อมูล: Request Rate, Error Rate, Pod Health และ Latency

---

## 🧪 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/` | Health check — ตรวจว่าแอปยังรันอยู่ |
| `GET` | `/metrics` | สำหรับให้ Prometheus มาดึงข้อมูล (Scrape) metrics ของแอปพลิเคชัน |
| `GET` | `/api/v1/tasks` | ดึงรายการ To-do ทั้งหมดจากฐานข้อมูล |
| `POST` | `/api/v1/tasks` | สร้างรายการ To-do ใหม่ |
| `PATCH` | `/api/v1/tasks/:id/toggle` | สลับสถานะการทำงาน (เช่น ทำแล้ว/ยังไม่ได้ทำ) ของรายการตาม ID |
| `DELETE` | `/api/v1/tasks/:id` | ลบรายการ To-do ที่ระบุตาม ID |

---

## 🐛 ปัญหาที่พบบ่อย (Troubleshooting)

### Pods ค้างอยู่ที่ Pending ไม่ยอม Running

```bash
kubectl describe pod [pod-name] -n todo-app
# ดูที่ Events: อาจเกิดจาก Resource บน Node ไม่พอ หรือเกิด Error ตอน Pull Image
```

### Jenkins Pipeline ล้มเหลวตอน Docker Build

```bash
# ตรวจสอบว่า Docker daemon รันอยู่หรือไม่
sudo systemctl start docker

# ตรวจสอบสิทธิ์ของ Jenkins user
sudo usermod -aG docker jenkins
```

### Prometheus แสดง Target เป็น DOWN

```bash
# ตรวจสอบว่าแอปเปิด /metrics ได้จริงหรือไม่
curl http://localhost:8080/metrics

# ตรวจสอบไฟล์ prometheus.yml ว่าตั้งค่า host:port ตรงกับ Service จริงหรือไม่
```

---

## 📚 เอกสารอ้างอิง

- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Terraform Kubernetes Provider](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

---

## 📄 ข้อมูลการส่งงาน

- **วิชา:** ENG23 3074 — Serverless and Cloud Architectures
- **อาจารย์ผู้สอน:** ดร. นันทวุฒิ คะอังกุ (AFHEA)
- **ภาควิชา:** วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีสุรนารี
