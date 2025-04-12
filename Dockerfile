FROM node:23-alpine AS builder

WORKDIR /app

# 필수 파일 복사
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 소스 복사 및 빌드
COPY . .
COPY .env.dev .env
RUN pnpm build

# 2단계: 경량 런타임
FROM node:23-alpine

WORKDIR /app

# standalone 실행 파일 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
