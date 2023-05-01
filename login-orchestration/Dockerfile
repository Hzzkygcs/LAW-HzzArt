FROM node:18

LABEL authors="valordra"

#WORKDIR /app
#COPY package*.json ./
# RUN npm install
#COPY . .



RUN ["mkdir", "/install"]
ADD ["./package.json", "/install"]
WORKDIR /install
RUN npm install --verbose
ENV NODE_PATH=/install/node_modules
WORKDIR /code-login-orchestration
COPY . /code-login-orchestration/



EXPOSE 8085

# CMD ["npm", "start"]
CMD ["npm", "run", "nodemon_run_legacy"]