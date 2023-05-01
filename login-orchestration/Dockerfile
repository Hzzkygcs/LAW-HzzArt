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
RUN rm -rf node_modules; ln -sf /install/node_modules .



EXPOSE 8085

ADD Dockerstart.sh /root/Dockerstart.sh
RUN chmod +x /root/Dockerstart.sh
CMD ["/root/Dockerstart.sh"]