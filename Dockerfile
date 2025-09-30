# Dockerfile (prod)
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Instala dependencias y build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
# copiar solo lo necesario
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
# Si usas assets estáticos, cópialos:
# COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]
