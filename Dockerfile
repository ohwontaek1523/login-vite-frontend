# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# 컨테이너의 80포트를 외부에 노출한다는 의미
# nginx는 기본적으로 80포트에서 실행됨 (nginx 자체 설정)
EXPOSE 80


#   - CMD: Dockerfile 명령어 - 컨테이너 시작 시 실행할 기본 명령
#   - nginx: nginx 웹 서버 실행
#   - -g "daemon off;": nginx 글로벌 설정

#   daemon off가 중요한 이유:
#   - 기본적으로 nginx는 백그라운드(daemon) 모드로 실행됨
#   - 백그라운드로 실행되면 프로세스가 바로 종료됨
#   - Docker는 메인 프로세스가 종료되면 컨테이너도 종료됨
#   - daemon off로 포어그라운드 실행하면 nginx가 계속 살아있음 → 컨테이너도 계속 실행
CMD ["nginx", "-g", "daemon off;"]
