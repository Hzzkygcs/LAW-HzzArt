# Use an official Node.js runtime as a parent image
FROM node:18
RUN apt-get -y install rsyslog


WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
