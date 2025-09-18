FROM node:18-alpine

# carpeta de trabajo
WORKDIR /usr/src/app

# copiar package.json y lock primero (mejor cacheo)
COPY package*.json ./

# instalar dependencias
RUN npm install

# copiar resto del código
COPY . .

# compilar TS
RUN npm run build

# exponer puerto
EXPOSE 3000

# comando por defecto
CMD ["npm", "start"]
