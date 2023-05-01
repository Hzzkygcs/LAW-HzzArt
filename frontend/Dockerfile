FROM node:18


RUN ["mkdir", "/install"]

ADD ["./package.json", "/install"]
WORKDIR /install
RUN npm install --verbose
ENV NODE_PATH=/install/node_modules

WORKDIR /code-frontend-service
COPY . /code-frontend-service/
RUN rm -rf node_modules; ln -sf /install/node_modules .

ADD Dockerstart.sh ./Dockerstart.sh
RUN chmod +x ./Dockerstart.sh
CMD ["./Dockerstart.sh"]
