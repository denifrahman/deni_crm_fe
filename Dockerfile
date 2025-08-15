
FROM node:18-alpine AS builder

WORKDIR /app


COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install   # bisa diganti 'yarn install' atau 'pnpm install' sesuai package manager


COPY . .


RUN npx nuxi build


FROM node:18-alpine

WORKDIR /app


COPY --from=builder /app/.output ./


RUN npm install --omit=dev || true


ENV NITRO_PORT=3000
EXPOSE 3000


CMD ["node", ".output/server/index.mjs"]
