FROM node:18

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install

RUN apt -y update


ENV NODE_ENV production
CMD ["npm", "start"]
