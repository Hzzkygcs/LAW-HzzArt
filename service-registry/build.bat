docker image prune --force --filter="label=eureka-hzzart"
docker build --tag eureka-hzzart:latest --label eureka-hzzart .
docker rm -f eureka-hzzart
docker run --name eureka-hzzart -p 8761:8761 eureka-hzzart
