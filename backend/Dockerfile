# Stage 1: Build
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Stage 2: Final Image
FROM alpine:latest
WORKDIR /app

# --- จุดที่ต้องเพิ่มเพื่อให้รันในไทยได้ไม่พัง ---
RUN apk add --no-cache tzdata

COPY --from=builder /app/main .
# ไม่ต้อง Copy .env เข้าไป เพราะเราส่งผ่าน docker-compose.yml แล้ว (เพื่อความปลอดภัย)

EXPOSE 8080
CMD ["./main"]