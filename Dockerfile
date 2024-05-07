# Use uma imagem base com Node.js instalado
FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos do projeto para o diretório de trabalho
COPY package*.json ./
COPY . .

# Instale as dependências
RUN npm install

# Exponha a porta em que a aplicação vai ser executada
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
