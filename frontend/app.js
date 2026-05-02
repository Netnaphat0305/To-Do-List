const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 1. Prometheus Metrics Setup ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom Metric: นับจำนวนการสร้าง Task
const taskCounter = new client.Counter({
  name: 'todo_tasks_created_total',
  help: 'Total number of tasks created via frontend',
});
register.registerMetric(taskCounter);

// Custom Metric: นับจำนวนการสลับสถานะ (Toggle)
const toggleCounter = new client.Counter({
  name: 'todo_tasks_toggled_total',
  help: 'Total number of times tasks were toggled',
});
register.registerMetric(toggleCounter);

// URL ของ Go Backend (ปรับตามความจริงของคุณ)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api/v1/tasks';

// --- 2. Routes ---

// หน้าแรก: แสดงรายการ To-Do และฟอร์มเพิ่มงาน
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(BACKEND_URL);
        const tasks = response.data || [];

        let taskListHtml = tasks.map(t => `
            <li style="margin-bottom: 15px; list-style: none; padding: 10px; border-bottom: 1px solid #eee;">
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
            </li>
        `).join('');

        res.send(`
            <div style="max-width: 600px; margin: 50px auto; font-family: Arial, sans-serif;">
                <h1 style="color: #333;">:🫒) My To-Do List</h1>
                
                <!-- ฟอร์มเพิ่ม Task ใหม่ -->
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3>เพิ่มงานใหม่</h3>
                    <form method="POST" action="/add">
                        <input type="text" name="title" placeholder="หัวข้อ (เช่น เตรียมสอบ Cloud)" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        <textarea name="description" placeholder="รายละเอียด..." style="width: 100%; padding: 8px; margin-bottom: 10px;"></textarea>
                        <button type="submit" style="background: #708238; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Add Task
                        </button>
                    </form>
                </div>

                <hr>
                
                <!-- รายการ Task -->
                <ul style="padding: 0;">
                    ${taskListHtml.length > 0 ? taskListHtml : '<p style="color: #999;">ยังไม่มีงานในรายการ...</p>'}
                </ul>

                <div style="margin-top: 30px; padding: 10px; background: #e9ecef; border-radius: 5px; text-align: center;">
                    <a href="/metrics" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">
                        ดูระบบ Monitoring (Metrics)
                    </a>
                </div>
            </div>
        `);
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).send('<h1>Error</h1><p>ไม่สามารถเชื่อมต่อกับ Go Backend ได้ กรุณาตรวจสอบว่า Backend รันอยู่ที่พอร์ต 8080</p>');
    }
});

// Endpoint สำหรับการเพิ่ม Task (ส่งต่อไปยัง Go Backend)
app.post('/add', async (req, res) => {
    try {
        await axios.post(BACKEND_URL, {
            title: req.body.title,
            description: req.body.description,
            status: "pending"
        });

        taskCounter.inc(); // เพิ่ม Metric เมื่อสร้างสำเร็จ
        res.redirect('/'); 
    } catch (err) {
        res.status(500).send('Error adding task');
    }
});

// Endpoint สำหรับการ Toggle สถานะ (ส่งต่อ PATCH ไปยัง Go Backend)
// ไฟล์ app.js ในโฟลเดอร์ frontend
app.post('/toggle/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        // เปลี่ยนจาก /done เป็น /toggle ให้ตรงกับ Backend
        await axios.patch(`${BACKEND_URL}/${taskId}/toggle`); 
        res.redirect('/');
    } catch (err) {
        res.status(500).send('ไม่สามารถสลับสถานะได้');
    }
});

// Prometheus Scrape Endpoint
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// --- 3. Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend To-Do List running on http://localhost:${PORT}`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});