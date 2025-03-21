# Use uma imagem do Node compatível com Prisma (>=18.18)
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de package e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e realiza o build
COPY . .
RUN npm run build

# Expõe a porta que sua aplicação usa (ex: 8000)
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
