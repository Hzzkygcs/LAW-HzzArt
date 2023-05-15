FROM docker:latest


WORKDIR /app
COPY ./eureka .


ENV DOCKER_HOST="tcp://eureka-hzzart:2375/"
ENV DOCKER_TLS_CERTDIR=""


#RUN update-alternatives --set iptables /usr/sbin/iptables-legacy
#RUN update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

CMD ["sh", "-c", "dockerd --iptables=false && docker compose up --build"]

