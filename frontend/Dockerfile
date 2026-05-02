FROM node:22-alpine

WORKDIR /app

# Copy package files และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# Copy โค้ดทั้งหมด
COPY . .

# เปิดพอร์ต 3000 ตามที่ Node.js Frontend ใช้
EXPOSE 3000

# รันด้วย node (สำหรับ production) หรือ nodemon (สำหรับ dev)
CMD ["node", "app.js"]