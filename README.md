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
- **ชื่อ:** To-Do-List 
- **ประเภท:** Full-stack Web Application (Microservices Architecture)
- **ภาษา / Framework:** - **Backend:** Golang (Gin Framework)
  - **Frontend:** Node.js (React / Next.js)
  - **Database:** PostgreSQL
- **คำอธิบาย:** เว็บแอปพลิเคชันสำหรับบันทึกและจัดการรายการสิ่งที่ต้องทำ เพื่อช่วยจัดระเบียบงานในชีวิตประจำวันและป้องกันการลืม โดยตัวระบบถูกออกแบบมาให้ทำงานบน Container และรองรับการทำ CI/CD เต็มรูปแบบ

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
├── backend/                # ระบบหลังบ้าน (Golang + Gin)
│   ├── config/             # การตั้งค่าฐานข้อมูล (Database Connection & Seeding)
│   ├── internal/           # Business Logic ตามโครงสร้าง Clean Architecture
│   │   ├── app/            # ส่วนหลัก: Controller, DTO, Entity, Repository
│   │   ├── middlewares/    # ส่วนจัดการ Request (เช่น CORS)
│   │   ├── routes/         # กำหนด API Endpoints
│   │   └── service/        # ส่วนจัดการ Logic การทำงานหลัก (Task Service)
│   ├── main.go             # จุดเริ่มต้นการทำงานของ Backend API
│   └── Dockerfile          # สำหรับสร้าง Container Image ของ Backend
│
├── frontend/               # ระบบหน้าบ้าน (Node.js/Express)
│   ├── app.js              # โค้ดหลักแสดงผล UI และทำ Metrics Exporter
│   └── Dockerfile          # สำหรับสร้าง Container Image ของ Frontend
│
├── k8s/                    # Kubernetes Manifests (ใช้สำหรับการ Deploy บน Cluster)
│   ├── backend/            # ไฟล์ Deploy หลังบ้าน และ Postgres DB
│   ├── frontend/           # ไฟล์ Deploy หน้าบ้าน
│   └── monitoring/         # ไฟล์สำหรับตั้งค่า Monitoring บน Kubernetes
│
├── prometheus/             # การตั้งค่าระบบ Monitoring
│   ├── prometheus.yml      # ไฟล์หลักกำหนดเป้าหมาย (Targets) ในการเก็บ Metrics
│   └── alert_rules.yml     # กำหนดเงื่อนไขการแจ้งเตือน (Alerting Rules)
│
├── terraform/              # Infrastructure as Code (IaC)
│   ├── main.tf             # ไฟล์หลักสำหรับจัดการโครงสร้างพื้นฐาน
│   └── *.tf                # ไฟล์แยกจัดการส่วน Backend, DB, Frontend และ Ingress
│
├── docker-compose.yml      # ไฟล์สำหรับรันระบบทั้งหมดในเครื่อง Local (Development)
├── Jenkinsfile             # ไฟล์กำหนดขั้นตอน CI/CD Pipeline อัตโนมัติ
├── .env                    # ไฟล์เก็บค่าตัวแปรสภาพแวดล้อม (Environment Variables)
└── README.md               # เอกสารอธิบายรายละเอียดโปรเจกต์
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ตรวจสอบให้แน่ใจว่าติดตั้งเครื่องมือเหล่านี้ครบถ้วนก่อนเริ่มรันโปรเจค เพื่อให้สภาพแวดล้อมตรงกับที่ใช้พัฒนา

| Tool | Version (Tested) | หน้าที่ |
|------|------------------|---------|
| **Git** | 2.50.x | จัดการ Source Code และ Version Control |
| **Go** | 1.24.x | รันและ Build ระบบ Backend API |
| **Node.js** | v22.17.x | รันและ Build ระบบ Frontend UI |
| **Docker** | 28.5.x | สร้างและจัดการ Container ของแอปพลิเคชัน |
| **Terraform** | 1.14.x | สร้างและจัดการ Infrastructure (IaC) |
| **kubectl** | v1.34.x | คำสั่งควบคุมและสั่งการ Kubernetes Cluster |
| **Jenkins** | ≥ 2.4xx | ระบบ CI/CD Automation สำหรับ Build และ Deploy |
| **Prometheus** | Latest | ระบบเก็บข้อมูล Metrics และตรวจสอบสถานะระบบ |
| **Grafana** | Latest | ระบบแสดงผล Dashboard และ Visualize ข้อมูล |

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
# รันระบบทั้งหมดในโหมด Background
สำหรับรันตัวแอปพลิเคชันและฐานข้อมูล (Local Development)
หากต้องการรันระบบทั้งหมดรวมถึง PostgreSQL ในเครื่องเพื่อทดสอบฟังก์ชัน
# รันระบบทั้งหมดในโหมด Background
docker-compose up -d --build
# เริ่มการทำงานของ Jenkins Container
docker start my-jenkins
# ตรวจสอบสถานะ Container ที่รันอยู่
docker ps
```

### 4. Build Image (สำหรับเตรียม Deploy)
```bash
# Build Backend Image
docker build -t [username]/todo-backend:latest ./backend
# Build Frontend Image
docker build -t [username]/todo-frontend:latest ./frontend
```

---
##  การสร้างและเตรียมแอปพลิเคชัน: Jenkins และ Docker

• **Jenkins (CI/CD Server):**  เมื่อได้รับ Webhook จะเริ่มทำงานตามขั้นตอนที่เขียนไว้ใน
  ไฟล์ Jenkinsfile โดยเริ่มจากการไปดึงโค้ดล่าสุดจาก GitHub ลงมา (Checkout)  
• **Docker:**  Jenkins จะรันคาสั่ง Docker เพื่อนำโค้ด Frontend และ Backend ไป
แพ็กใส่สิ่งที่เรียกว่า Docker Image (เหมือนการสร้างไฟล์ติดตั้งแอป)  
• **Docker Hub (Registry):**  เมื่อสร้างและทดสอบ Image เสร็จแล้ว Jenkins จะอัปโหลด
(Push) Image ทั้งสองตัวนี้ขึ้นไปฝากไว้ที่ Docker Hub เพื่อรอให้ระบบอื่นมาดึงไปใช้งาน
## 🔄 CI/CD Pipeline (Jenkins)

### ลำดับการทำงานของ Pipeline

```
Checkout ──▶ Build & Test ──▶ Docker Build ──▶ Test Docker Images ──▶ Push to Docker Hub ──▶ Deploy & Auto-Ingress
```

| Stage | คำอธิบาย |
|-------|----------|
| **Checkout** | ดึงโค้ดล่าสุดจาก GitHub |
| **Build & Test** | ติดตั้ง Dependencies ที่จำเป็นและรัน Unit Test เพื่อตรวจสอบความถูกต้องของแอปพลิเคชัน |
| **Test** | รัน unit test |
| **Docker Build** | เริ่มกระบวนการสร้าง Docker Images จาก Dockerfile ทั้งส่วน Frontend และ Backend |
| **Test Docker Images** | ตรวจสอบความสมบูรณ์ของ Docker Images ที่ถูกสร้างขึ้นก่อนนำไปใช้งานจริง |
| **Push to Docker Hub** | ทำการ Tag และ Push Docker Images ขึ้นไปเก็บไว้ที่ Docker Hub Registry |
| **Deploy & Auto-Ingress** | ใช้ Terraform และ kubectl ในการ Deploy แอปฯ ลงบน Kubernetes Cluster พร้อมตั้งค่า Ingress เพื่อให้เข้าถึงผ่านโดเมน todo.local ได้ทันที |

### วิธีตั้งค่า Jenkins
1. ติดตั้ง Jenkins และเปิดที่ `http://localhost:8080`
2. ติดตั้ง plugin: **Git**, **Pipeline**, **Docker Pipeline**
3. เพิ่ม credentials สำหรับ Docker Hub (ชื่อ `docker-hub-credentials`)
4. สร้าง Pipeline job ใหม่ และชี้ไปที่ repository นี้ https://github.com/Netnaphat0305/To-Do-List.git
5. ตั้งค่า Webhook ใน GitHub:
   - ไปที่ **Settings → Webhooks → Add webhook**
   - Payload URL: `https://throttle-fridge-jittery.ngrok-free.dev/github-webhook/`
   - Content type: `application/json`
   - ติ๊ก trigger: **Just the push event**

---

## 🏗️ Infrastructure as Code

### Terraform — Provision Infrastructure
**การจัดการโครงสร้างพื้นฐาน: Terraform**  
- หลังจากอัปโหลด Image เสร็จ Jenkins จะไปเรียกใช้งาน Terraform   
- Terraform ทำหน้าที่เป็นตัวจัดการ Infrastructure (IaC) โดยมันจะนำค่าตัวแปร เช่น รหัสผ่าน Database และ เลขเวอร์ชันของ Image ล่าสุด ไปสั่งการตั้งค่าบน Kubernetes
```bash
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform plan      # ตรวจสอบว่าจะสร้างอะไรบ้าง
terraform apply     # สร้าง resource จริง
```
> **สิ่งที่ Terraform สร้าง:** 
Namespace: todo-app สำหรับแยกส่วนการทำงาน
Workloads: Deployment ของ Frontend และ Backend API
Network: Kubernetes Services (NodePort/ClusterIP) และ Ingress Rules สำหรับโดเมน todo.local
Storage: Persistent Volumes สำหรับฐานข้อมูล PostgreSQL
Config: Management ของ Environment Variables และ ConfigMaps

## ☸️ Kubernetes Deployment
- Kubernetes จะรับคาสั่งจาก Terraform แล้วไปดึง Docker Image เวอร์ชันล่าสุดจาก
Docker Hub มารันเป็น Pods (ตัวรันแอปพลิเคชันจริง)  
- ภายใน K8s จะมีการเชื่อมต่อกันคือ: Frontend Pods คุยกับ Backend Pods และ
Backend Pods คุยกับ Database (PostgreSQL) ผ่านสิ่งที่เรียกว่า Service  
- Ingress (Nginx) ทำหน้าที่เป็นประตูรับ Request จากผู้ใช้ที่พิมพ์ URL 
todo.local แล้วส่ง (Route) ทราฟฟิกไปยัง Frontend, Grafana หรือ
Prometheus ให้ถูกต้อง

### Apply Manifests ด้วยตัวเอง
```bash
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml  
kubectl apply -f k8s/backend/postgres.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods -n todo-app 
kubectl get svc  -n todo-app 
```

### ผลลัพธ์ที่ควรจะได้
```
NAME                             READY   STATUS    RESTARTS       AGE
grafana-7d7dd7b7b-7v5fv          1/1     Running   1 (114m ago)   5h54m
postgres-59449bfb7b-czd7l        1/1     Running   1 (114m ago)   5h55m
prometheus-5d767fb57d-thsgc      1/1     Running   1 (114m ago)   5h54m
todo-backend-5cd6d5994-kv5ph     1/1     Running   4 (114m ago)   5h55m
todo-backend-5cd6d5994-s5hct     1/1     Running   4 (114m ago)   5h55m
todo-frontend-6498649f6b-twj4h   1/1     Running   1 (114m ago)   5h55m
todo-frontend-6498649f6b-vp7dx   1/1     Running   1 (114m ago)   5h55m

NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
grafana-service         ClusterIP   10.96.74.1      <none>        3000/TCP       5h55m
postgres-service        ClusterIP   10.96.227.165   <none>        5432/TCP       5h55m
prometheus-service      ClusterIP   10.96.37.113    <none>        9090/TCP       5h55m
todo-backend-service    ClusterIP   10.96.216.151   <none>        80/TCP         5h55m
todo-frontend-service   NodePort    10.96.222.234   <none>        80:30005/TCP   5h55m
```

### การเข้าถึงแอปพลิเคชัน

เนื่องจากระบบมีการใช้ **Ingress Controller** เพื่อจัดการเส้นทาง (Routing) คุณสามารถเข้าถึงบริการต่างๆ ผ่าน Domain Name ได้ดังนี้:

| บริการ | URL สำหรับเข้าใช้งาน |
|------|--------------------|
| **Frontend UI** | [http://todo.local](http://todo.local) |
| **Grafana Dashboard** | [http://todo.local/grafana](http://todo.local/grafana) |
| **Prometheus UI** | [http://todo.local/prometheus/targets](http://todo.local/prometheus/targets) |

---

### การตั้งค่าเพิ่มเติมสำหรับเครื่อง Local
เพื่อให้เครื่องของคุณรู้จักชื่อ `todo.local` คุณจำเป็นต้องเพิ่ม IP ของ Kubernetes Cluster ลงในไฟล์ `hosts` ของเครื่องคุณก่อน:

1. **ตรวจสอบ IP ของ Ingress:**
   ```bash
   kubectl get ingress -n todo-app

---

## 📊 Monitoring

### Prometheus — เก็บ Metrics
- **Prometheus:**  เป็นระบบ Monitoring ที่ถูกติดตั้งอยู่ใน K8s จะคอยวิ่งไปดึงข้อมูล
(Scrape metrics) จาก Endpoint 
/metrics ของ Frontend และ Backend ทุกๆ
15 วินาที เพื่อเก็บสถิติ เช่น มีงานค้างกี่ชิ้น หรือกิน CPU ไปเท่าไหร่
- ไฟล์ config: `monitoring/prometheus.yml`
- Scrape ทุก **15 วินาที**
- Target endpoint: `http://todo.local/metrics`
```bash
# เปิด UI ที่ http://todo.local/prometheus/targets
```
### Grafana — แสดง Dashboard
ทำหน้าที่เป็นหน้าจอแสดงผล (Dashboard) โดยมันจะไปดึงฐานข้อมูลตัวเลข
จาก Prometheus มาแปลงเป็นกราฟดูสถานะของระบบได้แบบเรียลไทม์  
แบ่งข้อมูลที่แสดงออกเป็นทั้งหมด 6 ค่า ดังตาราง Panels ใน Dashboard

- ไฟล์ dashboard: `monitoring/grafana-dashboard.json`
- Data source: Prometheus (`http://localhost:9090`)

วิธี import dashboard:
1. เปิด Grafana ที่ `http://localhost:3000 หรือ http://todo.local/grafana`
2. ไปที่ **Dashboards → Import**
3. อัปโหลดไฟล์ `grafana-dashboard.json`

### Panels ใน Dashboard

| Panel | Metric (PromQL) | แสดงข้อมูลอะไร |
|-------|-----------------|----------------|
| งานที่ค้างอยู่ (Pending) | `todo_tasks_pending_current` | จำนวนงานที่ยังไม่ได้ทำ |
| สำเร็จแล้ว (Completed) | `todo_tasks_completed_current` | จำนวนงานที่เช็คถูกว่าทำเสร็จแล้ว |
| งานทั้งหมดในระบบ | `todo_tasks_total_current` | ผลรวมรายการงานทั้งหมดในฐานข้อมูล |
| CPU Usage | `rate(process_cpu_user_seconds_total[1m])` | การใช้งาน CPU ของโปรเซสแอป |
| Memory Usage | `process_resident_memory_bytes` | หน่วยความจำที่แอปใช้งานจริง |
| Event Loop Lag | `nodejs_eventloop_lag_seconds` | ความหน่วงของ Event Loop ใน Node.js |
---

## 🌿 Branching Strategy

ระบบใช้การจัดการ Branch ตามโครงสร้างความรับผิดชอบของสมาชิกในกลุ่ม เพื่อให้สามารถพัฒนาแต่ละส่วนขนานกันได้อย่างมีประสิทธิภาพก่อนจะนำมารวมกันที่ Branch หลัก


| Branch | ผู้รับผิดชอบ | รายละเอียดการพัฒนา |
|--------|-------------|-------------------|
| `main` | **ทุกคน** | Branch หลักที่เป็นโค้ดชุดสมบูรณ์ (Production-ready) |
| `Looktao` | เนตรนภัทร | พัฒนาส่วน Web Application (Frontend & Backend API) |
| `fluk` | ณัฐสิทธิ์ | พัฒนาส่วน Jenkins Pipeline และ Docker Configuration |
| `som` | พิมพ์นารา | พัฒนาส่วน Infrastructure as Code (Terraform) |
| `Chompoo` | พนิดา | พัฒนาส่วน Monitoring (Prometheus & Grafana) |

### กระบวนการทำงาน (Workflow)
1. **แยกทำงาน (Isolation):** สมาชิกแต่ละคนพัฒนาฟีเจอร์ใน Branch ของตัวเองตามความรับผิดชอบ
2. **การรวมโค้ด (Integration):** เมื่อพัฒนาแต่ละส่วนเสร็จสิ้นและผ่านการทดสอบ จะทำการ Merge เข้าสู่ Branch `main`
3. **อัตโนมัติ (Automation):** เมื่อมีการ Update ที่ Branch `main` ระบบ Jenkins จะทำการ Trigger Pipeline เพื่อ Deploy แอปพลิเคชันโดยอัตโนมัติ

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

**jenkins Pipeline ล้มเหลวใน Stage "Deploy & Auto-Ingress" (TLS/SSL Error)**
```bash
# สาเหตุ: คำสั่ง kubectl พยายามตรวจสอบใบรับรองความปลอดภัย (Certificate) ของ Cluster แต่ไม่สำเร็จ ทำให้ Pipeline หยุดทำงาน
#การแก้ไข: เพิ่ม Flag --insecure-skip-tls-verify ในทุกคำสั่งของ kubectl ภายใน Jenkinsfile เพื่อข้ามการตรวจสอบ Certificate
sh "kubectl --insecure-skip-tls-verify apply -f k8s/monitoring/monitoring.yaml"
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
curl http://todo.local/metrics
# ตรวจ prometheus.yml ว่า host:port ตรงกับแอปจริง
```

---
## ไฟล์รายละเอียดโปรเจกต์ (PDF)

[ดาวน์โหลดไฟล์รายละเอียดโปรเจกต์ (PDF)](./Project-ServerlessPDF.pdf)


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
              **คุณ จริณ เจริญศิริ ตำแหน่ง Cloud Engineer บริษัท กรุงศรี นิมเบิล จำกัด**
- ภาควิชาวิศวกรรมคอมพิวเตอร์
