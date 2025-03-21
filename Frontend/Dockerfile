# Etapa 1: Instalação das dependências
FROM node:20-alpine AS deps
WORKDIR /app
# Copia arquivos de dependências
COPY package.json package-lock.json* yarn.lock* ./
# Instala as dependências de forma limpa
RUN npm ci

# Etapa 2: Build da aplicação
FROM node:20-alpine AS builder
WORKDIR /app
# Copia a pasta node_modules da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia todo o código da aplicação
COPY . .
# Compila a aplicação NextJS
RUN npm run build

# Etapa 3: Imagem final para produção
FROM node:20-alpine AS runner
WORKDIR /app
# Define a variável de ambiente para produção
ENV NODE_ENV production
# Copia os arquivos necessários da etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta 3000 (conforme definido no docker-compose)
EXPOSE 3000
# Inicia a aplicação
CMD ["npm", "start"]
