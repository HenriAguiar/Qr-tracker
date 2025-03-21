FROM node:20-alpine
WORKDIR /app
# Copia os arquivos de dependência e o .env
COPY package*.json ./
COPY .env ./
# Copia a pasta prisma (onde está o schema)
COPY prisma ./prisma
# Instala as dependências
RUN npm install
# Copia o restante dos arquivos
COPY . .
# Realiza o build da aplicação
RUN npm run build
EXPOSE 8000
# Run migrations at startup and then start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm start"]