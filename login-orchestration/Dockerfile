FROM node:18

LABEL authors="valordra"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "start"]
