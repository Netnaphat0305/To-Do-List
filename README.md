# 🚀 To-Do List — ENG23 3074

>  เว็ป To-Do-List สร้างด้วย Golang และ Node.js containerize ด้วย Docker และ deploy บน Kubernetes ผ่าน Jenkins pipeline แบบอัตโนมัติ

---

## 👥 สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล | ความรับผิดชอบ |
|-------------|-------------|---------------|
| B6608019 | นาวสาวเนตรนภัทร ชำนินอก | Git, App Development |
| B6609023 | นายณัฐสิทธิ์ มามั่น | Jenkins, Docker |
| B6639334 | นางสาวพิมพ์นารา อดุลจันทรศร | Terraform |
| B6643041 | นางสาวพนิดา โต๊ะเหลือ | Kubernetes, Monitoring |

---

## 📌 ภาพรวมโปรเจค

### แอปพลิเคชัน
- **ชื่อ:** [ชื่อแอป]
- **ประเภท:** [เช่น REST API / Web App]
- **ภาษา / Framework:** [Go / Node.js Express]
- **คำอธิบาย:** เว็ปนี้ใช้สำหรับบันทึกรายการที่ต้องทำ เพื่อป้องกันการลืมในสิ่งที่ต้องทำในชีวิตประจำวัน

### Architecture Diagram
```
        Developer 
             │
             ▼  git push
          GitHub ────── Webhook ───────▶ Jenkins (CI/CD Pipeline)
                                            │
    ┌───────────────────────────────────────┴──────────────────────────────────────┐
    ▼               ▼               ▼               ▼               ▼              ▼
 1.Checkout ──▶ 2.Build ──▶ 3.Test ──▶ 4.Docker Build ──▶ 5.Push Hub ──▶ 6.Deploy
 (Pull Source)  (Install Deps) (Unit Test)   (Create Image)    (Docker Hub)   (Terraform)
                                                                    │              │
                                                                    ▼              ▼
                                                               Docker Hub ──▶ Kubernetes
                                                                            (todo-app NS)
                                                                           ┌──────────────┐
                                                                           │  ┌────────┐  │
                                                                           │  │  Pod   │  │
             ┌────────────── Monitoring ──────────────┐                    │  │ [App]  │  │
             ▼                                        ▼                    │  └────────┘  │
        Prometheus <───────── Scrape ────────── Backend Pod ───────────────┼──▶ PostgreSQL│
     (Metrics/Logs)         (/metrics)         (Go Server)                 │   (Database) │
             │                                        │                    │              │
             ▼                                        ▼                    │  ┌────────┐  │
          Grafana <───────── Visualize ───────── Frontend Pod <────────────┼──▶ Service   │
        (Dashboard)                            (React/Next.js)             │  (NodePort)  │
                                                                           └──────┬───────┘
                                                                                  │
                                                                            User Access
```

---

## 📁 โครงสร้าง Repository

```
To-Do-List/
├── backend/                # ส่วนของ API (Golang)
│   ├── internal/           # Business Logic หลักของระบบ
│   │   ├── app/            # ประกอบด้วย Controller, Entity, Repository
│   │   ├── middlewares/    # ส่วนจัดการ Request (เช่น CORS, Auth)
│   │   ├── routes/         # ส่วนกำหนดเส้นทาง API (Endpoints)
│   │   └── service/        # ส่วนจัดการ Logic การทำงาน (Task Service)
│   ├── Dockerfile          # สำหรับสร้าง Backend Image
│   └── main.go             # Entry point ของแอปพลิเคชัน
│   └── go.mod              # ไฟล์จัดการ dependencies ของ Go
├── frontend/               # ส่วนของ UI (Node.js/React)
│   ├── app.js              # โค้ดหลักของ Frontend
│   ├── Dockerfile          # คำสั่งสร้าง Image ของ Frontend
│   └── package.json        # ไฟล์จัดการ dependencies ของ Node.js
├── jenkins/                # ไฟล์กำหนด Automation Pipeline
│   ├── build/              # Pipeline สำหรับการ Build และ Test
│   │   ├── Jenkinsfile_backend
│   │   └── Jenkinsfile_frontend
│   └── deploy/             # Pipeline สำหรับการ Deploy
│       ├── Jenkinsfile_backend
│       └── Jenkinsfile_frontend
├── k8s/                    # Kubernetes Manifests
│   ├── backend/            # ตั้งค่าสำหรับ Backend
│   │   ├── deployment.yaml
│   │   ├── postgres.yaml   # ตั้งค่า Database
│   │   └── service.yaml
│   └── frontend/           # ตั้งค่าสำหรับ Frontend
│       ├── deployment.yaml
│       └── service.yaml
├── docker-compose.yml      # สำหรับรันทุกอย่างพร้อมกันในเครื่อง (Local)
└── README.md
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ตรวจสอบให้แน่ใจว่าติดตั้งทุก tool ครบก่อนรันโปรเจค

| Tool | Version | หน้าที่ |
|------|---------|---------|
| Git | ≥ 2.x | จัดการ source code |
| Docker | ≥ 24.x | สร้างและรัน container |
| Jenkins | ≥ 2.4xx | ระบบ CI/CD automation |
| Terraform | ≥ 1.x | Provision infrastructure |
| Ansible | ≥ 2.15 | Configure environment |
| kubectl | ≥ 1.28 | สั่งงาน Kubernetes cluster |
| Minikube / K3s | latest | Kubernetes แบบ local |
| Prometheus | ≥ 2.x | เก็บ metrics |
| Grafana | ≥ 10.x | แสดง dashboard |

---

## 🏃 วิธีรันโปรเจค (Quick Start)

### 1. Clone Repository
```bash
git clone https://github.com/Netnaphat0305/To-Do-List.git
cd To-Do-List
```

### 2. รันแอปบนเครื่องโดยตรง (ไม่ผ่าน pipeline)
```bash
cd backend
go mod download
go run main.go
# API รันที่ http://localhost:8080
cd frontend
npm install
npm start
# UI รันที่ http://localhost:3000
```

### 3. Build และรันด้วย Docker
```bash
# Build Backend
docker build -t [username]/todo-backend:latest ./backend
# Build Frontend
docker build -t [username]/todo-frontend:latest ./frontend
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### ลำดับการทำงานของ Pipeline

```
Checkout ──▶ Build ──▶ Test ──▶ Docker Build ──▶ Push to Hub ──▶ Deploy
```

| Stage | คำอธิบาย |
|-------|----------|
| **Checkout** | ดึงโค้ดล่าสุดจาก GitHub |
| **Build** | ติดตั้ง dependencies |
| **Test** | รัน unit test |
| **Docker Build** | สร้าง Docker image |
| **Push to Hub** | อัปโหลด image ขึ้น Docker Hub |
| **Deploy** | รัน Terraform + Ansible แล้ว apply Kubernetes manifests |

### วิธีตั้งค่า Jenkins
1. ติดตั้ง Jenkins และเปิดที่ `http://localhost:8080`
2. ติดตั้ง plugin: **Git**, **Pipeline**, **Docker Pipeline**
3. เพิ่ม credentials สำหรับ Docker Hub (ชื่อ `dockerhub-credentials`)
4. สร้าง Pipeline job ใหม่ และชี้ไปที่ repository นี้
5. ตั้งค่า Webhook ใน GitHub:
   - ไปที่ **Settings → Webhooks → Add webhook**
   - Payload URL: `http://[jenkins-host]:8080/github-webhook/`
   - Content type: `application/json`
   - ติ๊ก trigger: **Just the push event**

---

## 🏗️ Infrastructure as Code

### Terraform — Provision Infrastructure
```bash
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform plan      # ตรวจสอบว่าจะสร้างอะไรบ้าง
terraform apply     # สร้าง resource จริง
```
> **สิ่งที่ Terraform สร้าง:** [อธิบาย เช่น Docker network, Kubernetes namespace, local directory]

### Ansible — Configure Environment
```bash
cd ansible
ansible-playbook -i inventory playbook.yml
```
> **สิ่งที่ Ansible ทำ:** [อธิบาย เช่น ติดตั้ง kubectl, copy kubeconfig, ตั้งค่า environment variable]

> ⚠️ **หมายเหตุ:** ใน pipeline จริง Jenkins จะเรียก Terraform และ Ansible อัตโนมัติในขั้นตอน Deploy ไม่ต้องรันด้วยมือ

---

## ☸️ Kubernetes Deployment

### Apply Manifests ด้วยตัวเอง
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods -n [namespace]
kubectl get svc  -n [namespace]
```

### ผลลัพธ์ที่ควรจะได้
```
NAME                        READY   STATUS    RESTARTS   AGE
[app-name]-xxxxxxxxx-xxxxx  1/1     Running   0          2m
[app-name]-xxxxxxxxx-yyyyy  1/1     Running   0          2m

NAME            TYPE       CLUSTER-IP     PORT(S)          AGE
[app-name]-svc  NodePort   10.96.xx.xxx   5000:30080/TCP   2m
```

### เข้าถึงแอปพลิเคชัน
```
http://localhost:30080
```

---

## 📊 Monitoring

### Prometheus — เก็บ Metrics
- ไฟล์ config: `monitoring/prometheus.yml`
- Scrape ทุก **15 วินาที**
- Target endpoint: `http://[app-host]:[port]/metrics`

รัน Prometheus:
```bash
prometheus --config.file=monitoring/prometheus.yml
# เปิด UI ที่ http://localhost:9090
```

### Grafana — แสดง Dashboard
- ไฟล์ dashboard: `monitoring/grafana-dashboard.json`
- Data source: Prometheus (`http://localhost:9090`)

วิธี import dashboard:
1. เปิด Grafana ที่ `http://localhost:3000`
2. ไปที่ **Dashboards → Import**
3. อัปโหลดไฟล์ `grafana-dashboard.json`

### Panels ใน Dashboard

| Panel | Metric (PromQL) | แสดงข้อมูลอะไร |
|-------|-----------------|----------------|
| Request Rate | `rate(http_requests_total[1m])` | จำนวน request ต่อวินาที |
| Error Rate | `rate(http_requests_total{status=~"5.."}[1m])` | จำนวน error 5xx ต่อวินาที |
| Latency (p95) | `histogram_quantile(0.95, ...)` | response time ที่ percentile 95 |
| Pod Health | `up{job="[app-name]"}` | service ขึ้นหรือล่ม (1/0) |

---

## 🌿 Branching Strategy

```
main        ──── โค้ดที่พร้อม production, protected branch
dev         ──── รวมโค้ดก่อน merge ขึ้น main
feature/*   ──── พัฒนา feature แต่ละอัน (เช่น feature/add-login)
```

| Branch | Protected | คำอธิบาย |
|--------|-----------|----------|
| `main` | ✅ | trigger pipeline อัตโนมัติเมื่อ merge |
| `dev` | ✅ | ทดสอบก่อน merge ขึ้น main |
| `feature/*` | ❌ | พัฒนาแยกกันแล้วค่อย merge เข้า dev |

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

**Pods ค้างอยู่ที่ `Pending` ไม่ยอม Running**
```bash
kubectl describe pod [pod-name] -n [namespace]
# ดูที่ Events: อาจเกิดจาก resource ไม่พอ หรือ image pull error
```

**Jenkins pipeline ล้มเหลวตอน Docker Build**
```bash
# ตรวจว่า Docker daemon รันอยู่
sudo systemctl start docker
# เพิ่ม jenkins user เข้า docker group
sudo usermod -aG docker jenkins
```

**Prometheus แสดง target เป็น DOWN**
```bash
# ตรวจว่าแอปเปิด /metrics ได้จริง
curl http://localhost:5000/metrics
# ตรวจ prometheus.yml ว่า host:port ตรงกับแอปจริง
```

---

## 📚 เอกสารอ้างอิง

- [Jenkinsfile Declarative Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

---

## 📄 ข้อมูลการส่งงาน

- วิชา: **ENG23 3074 — Serverless and Cloud Architectures**
- อาจารย์ผู้สอน: **ดร. นันทวุฒิ คะอังกุ (AFHEA)**
- ภาควิชาวิศวกรรมคอมพิวเตอร์
