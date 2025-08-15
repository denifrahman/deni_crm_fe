FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx nuxi build


FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.output ./


COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev || true

ENV NITRO_PORT=8080
EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
