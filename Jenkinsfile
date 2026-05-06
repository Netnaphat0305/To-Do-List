pipeline {
    agent any
    
    environment {
        DOCKER_USER = "nattasitfluk"
        FE_IMAGE    = "${DOCKER_USER}/todo-frontend"
        BE_IMAGE    = "${DOCKER_USER}/todo-backend"
        IMAGE_TAG   = "v${env.BUILD_NUMBER}" 
    }

    stages {
        stage('1. Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('2. Build & Test') {
            steps {
                echo "Preparing All Services for version: ${IMAGE_TAG}"
            }
        }

        stage('3. Docker Build') {
            steps {
                script {
                    echo 'Building Both Frontend & Backend Images...'
                    sh "cd frontend && docker build -t ${FE_IMAGE}:${IMAGE_TAG} -t ${FE_IMAGE}:latest ."
                    sh "cd backend && docker build -t ${BE_IMAGE}:${IMAGE_TAG} -t ${BE_IMAGE}:latest ."
                }
            }
        }

        stage('4. Test Docker Images') {
            steps {
                sh "docker run --rm ${FE_IMAGE}:${IMAGE_TAG} echo 'Frontend OK'"
                sh "docker run --rm ${BE_IMAGE}:${IMAGE_TAG} echo 'Backend OK'"
            }
        }

        stage('5. Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'U', passwordVariable: 'P')]) {
                    sh "echo \$P | docker login -u \$U --password-stdin"
                    sh "docker push ${FE_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${FE_IMAGE}:latest"
                    sh "docker push ${BE_IMAGE}:${IMAGE_TAG}"
                    sh "docker push ${BE_IMAGE}:latest"
                }
            }
        }

        stage('6. Deploy & Auto-Ingress') {
            steps {
                // ดึงรหัสผ่านจาก Jenkins Credentials (ID: DB_PASSWORD)
                withCredentials([string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASS_VAR')]) {
                    dir('terraform') {
                        sh 'terraform init -upgrade'
                        // ส่งรหัสผ่านผ่าน TF_VAR_db_password เพื่อเข้าตัวแปรใน Terraform
                        sh """
                            export TF_VAR_db_password=${DB_PASS_VAR}
                            terraform apply -auto-approve -var='image_tag=${IMAGE_TAG}'
                        """
                    }
                }
                sh "kubectl rollout status deployment/todo-frontend -n todo-app"
                sh "kubectl rollout status deployment/todo-backend -n todo-app"
                echo "🚀 All Services Updated! เข้าเว็บที่ http://todo.local"
            }
        }
    }

    post {
        always {
            sh "docker rmi ${FE_IMAGE}:${IMAGE_TAG} ${BE_IMAGE}:${IMAGE_TAG} || true"
            sh "docker logout || true"
            cleanWs()
        }
    }
} 