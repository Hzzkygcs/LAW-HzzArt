# FROM jrottenberg/ffmpeg
FROM node:18
RUN apt-get -y install rsyslog

RUN ["mkdir", "/install"]

ADD ["./package.json", "/install"]
WORKDIR /install
RUN npm install --verbose
ENV NODE_PATH=/install/node_modules

#RUN apt -y update
#RUN apt -y install ffmpeg

WORKDIR /app-codes
COPY . /app-codes/
RUN rm -rf node_modules; ln -sf /install/node_modules .

#CMD ["npm", "run", "nodemon_run_legacy"]
CMD ["sh", "-c", "npm run nodemon_run_legacy"]