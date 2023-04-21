FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

RUN apt -y update
RUN apt -y install ffmpeg


COPY . .

ENV NODE_ENV production
CMD ["npm", "start"]
