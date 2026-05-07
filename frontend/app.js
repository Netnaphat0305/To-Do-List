const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 1. Prometheus Metrics Setup ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// [แก้ไข] เปลี่ยนจาก Counter เป็น Gauge ทั้งหมด เพื่อให้เลข "ขึ้น-ลง" ได้ตามจริง
const pendingGauge = new client.Gauge({
  name: 'todo_tasks_pending_current',
  help: 'จำนวนงานที่ค้างอยู่ในรายการปัจจุบัน',
});

const completedGauge = new client.Gauge({
  name: 'todo_tasks_completed_current',
  help: 'จำนวนงานที่เสร็จแล้วในรายการปัจจุบัน',
});

const totalGauge = new client.Gauge({
  name: 'todo_tasks_total_current',
  help: 'จำนวนงานทั้งหมดที่มีอยู่ในระบบตอนนี้',
});

register.registerMetric(pendingGauge);
register.registerMetric(completedGauge);
register.registerMetric(totalGauge);

// URL ของ Go Backend (ปรับตามความจริงของคุณ)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api/v1';

// Helper Function สำหรับสร้าง HTML ของแต่ละรายการ (รักษา Style เดิม)
const renderTask = (t) => `
    <li style="margin-bottom: 15px; list-style: none; padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 15px;">
                    <!-- ส่วนของปุ่ม Toggle State -->
                    <form method="POST" action="/toggle/${t.id}">
                <button type="submit" style="background: none; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; padding: 5px 10px; font-size: 1.2rem;">
                    ${t.status === 'completed' ? '🫒' : '⬜'} 
                </button>
            </form>
            
            <div style="flex-grow: 1;">
                <strong style="font-size: 1.1rem; ${t.status === 'completed' ? 'text-decoration: line-through; color: #888;' : ''}">
                    ${t.title}
                </strong>
                <br>
                <span style="color: #666;">${t.description || 'ไม่มีคำอธิบาย'}</span>
                        <br>
                        <small style="color: #aaa;">สถานะ: ${t.status} | สร้างเมื่อ: ${new Date(t.created_at).toLocaleString()}</small>
            </div>
        </div>

        <!-- เพิ่มปุ่มลบ (Delete) -->
        <form method="POST" action="/delete/${t.id}" style="margin: 0;" onsubmit="return confirm('ลบงานนี้ใช่ไหม?')">
            <button type="submit" style="background: #f39bbd; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                ลบ
            </button>
        </form>
    </li>
`;

// --- 2. Routes ---

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/tasks`);
        const tasks = response.data || [];

        // แยกงานตามสถานะ
        const pendingTasks = tasks.filter(t => t.status !== 'completed');
        const completedTasks = tasks.filter(t => t.status === 'completed');

        res.send(`
            <div style="max-width: 600px; margin: 50px auto; font-family: Arial, sans-serif;">
                <h1 style="color: #333;">:🫒) My To-Do List</h1>
                
                <!-- ฟอร์มเพิ่ม Task ใหม่ -->
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>เพิ่มงานใหม่</h3>
                    <form method="POST" action="/add">
                        <input type="text" name="title" placeholder="หัวข้อ (เช่น เตรียมสอบ Cloud)" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        <textarea name="description" placeholder="รายละเอียด..." style="width: 100%; padding: 8px; margin-bottom: 10px;"></textarea>
                        <button type="submit" style="background: #788b59; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Add Task
                        </button>
                    </form>
                </div>

                <hr>
                
                <!-- ส่วนของงานที่ยังไม่เสร็จ -->
                <h3 style="color: #788b59;">🪷 รายการที่ต้องทำ</h3>
                <ul style="padding: 0;">
                    ${pendingTasks.length > 0 ? pendingTasks.map(renderTask).join('') : '<p style="color: #999;">เย้! ไม่มีงานค้างแล้ว</p>'}
                </ul>

                <!-- ส่วนของงานที่เสร็จแล้ว (เพิ่มใหม่) -->
                <h3 style="color: #888; margin-top: 30px;">🍵 สำเร็จแล้ว</h3>
                <ul style="padding: 0; opacity: 0.7;">
                    ${completedTasks.length > 0 ? completedTasks.map(renderTask).join('') : '<p style="color: #999;">ยังไม่มีงานที่เสร็จสมบูรณ์</p>'}
                </ul>

                <div style="margin-top: 30px; padding: 10px; background: #e9ecef; border-radius: 5px; text-align: center;">
                    <a href="/metrics" target="_blank" style="color: #f4c1d0; text-decoration: none; font-weight: semi-bold;">
                        ดูระบบ Monitoring (Metrics)
                    </a>
                </div>
            </div>
        `);
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).send('<h1>Error</h1><p>ไม่สามารถเชื่อมต่อกับ Go Backend ได้</p>');
    }
});

// Endpoint สำหรับการเพิ่ม Task (ส่งต่อไปยัง Go Backend)
app.post('/add', async (req, res) => {
    try {
        await axios.post(`${BACKEND_URL}/tasks`, { // แก้ตรงนี้: เติม /tasks
            title: req.body.title,
            description: req.body.description,
            status: "pending"
        });
        taskCounter.inc();
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send('Error adding task');
    }
});

// Endpoint สำหรับการ Toggle สถานะ (ส่งต่อ PATCH ไปยัง Go Backend)
// ไฟล์ app.js ในโฟลเดอร์ frontend
app.post('/toggle/:id', async (req, res) => {
    try {
        await axios.patch(`${BACKEND_URL}/tasks/${req.params.id}/toggle`); // แก้ตรงนี้: เติม /tasks
        toggleCounter.inc();
        res.redirect('/');
    } catch (err) { res.status(500).send('ไม่สามารถสลับสถานะได้'); }
});

// Endpoint สำหรับลบงาน (เพิ่มใหม่)
app.post('/delete/:id', async (req, res) => {
    try {
        await axios.delete(`${BACKEND_URL}/tasks/${req.params.id}`); // แก้ตรงนี้: เติม /tasks
        deleteCounter.inc();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('ไม่สามารถลบงานได้');
    }
});

// [แก้ไขใหม่] Prometheus Scrape Endpoint
app.get('/metrics', async (req, res) => {
    try {
        // วิ่งไปดึงข้อมูลจริงจาก Go Backend
        const response = await axios.get(`${BACKEND_URL}/tasks`);
        const tasks = response.data || [];

        // คำนวณจำนวนงานปัจจุบันจากสถานะจริง
        const pendingCount = tasks.filter(t => t.status !== 'completed').length;
        const completedCount = tasks.filter(t => t.status === 'completed').length;
        const totalCount = tasks.length;

        // สั่งอัปเดตค่า Gauge (ตัวเลขใน Grafana จะเปลี่ยนตามค่าเหล่านี้ทันที)
        pendingGauge.set(pendingCount);
        completedGauge.set(completedCount);
        totalGauge.set(totalCount);

        res.setHeader('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        console.error("Error updating metrics:", err.message);
        res.status(500).send("Error updating metrics");
    }
});

// --- 3. Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend To-Do List running on http://localhost:${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});