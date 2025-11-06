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
# Copiar firebase credentials desde la raíz (opcional - requerido solo si no se monta como volumen)
# NOTA: En producción, se recomienda montar este archivo como volumen o secret en lugar de copiarlo en la imagen
# Si el archivo no existe, este COPY fallará - en ese caso, monta el archivo como volumen en docker-compose o kubernetes
COPY --from=builder /usr/src/app/firebase-service-account.json ./firebase-service-account.json
# Si usas assets estáticos, cópialos:
# COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]
