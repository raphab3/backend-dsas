# Use a imagem oficial do Node.js 20 como base
FROM node:20

# Instale o pnpm e PM2 globalmente
RUN npm install -g pnpm pm2

# Crie o diretório da aplicação
WORKDIR /usr/src/app

# Copie os arquivos pnpm-lock.yaml e package.json
COPY pnpm-lock.yaml package.json ./

# Instale as dependências do projeto
RUN pnpm install

# Copie os arquivos do projeto para o diretório de trabalho
COPY . .

# Compile a aplicação
RUN pnpm run build

# Exponha a porta que a aplicação usa
EXPOSE 3000

# Comando para executar a aplicação com PM2
CMD ["pm2-runtime", "dist/main.js"]