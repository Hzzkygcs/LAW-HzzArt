sudo docker-compose down --volumes --rmi
sudo docker rm -vf $(sudo docker ps -aq)
sudo docker rmi -f $(sudo docker images -aq)
sudo docker-compose rm -f
sudo docker-compose pull
sudo docker-compose build --no-cache
sudo docker-compose up
# inget jalanin sysctl -w vm.max_map_count=262144 di docker host yang punya elk