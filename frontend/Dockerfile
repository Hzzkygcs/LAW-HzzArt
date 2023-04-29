FROM node:18

# only for production

WORKDIR /code-frontend-service

#WORKDIR /app
COPY package*.json ./
#COPY . .

RUN file="$(ls | wc -l)" && echo $file
RUN file="$(ls -a .)" && echo $file
RUN file="$(pwd)" && echo $file
RUN echo "\n"

RUN npm install

# RUN apt -y update


ENV NODE_ENV production
CMD ["npm", "run", "nodemon_run_legacy"]
