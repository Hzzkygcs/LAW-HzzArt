FROM node:16

WORKDIR /app
COPY package*.json ./
RUN npm install

RUN apt -y update
RUN apt -y install ffmpeg


COPY . .

ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]
