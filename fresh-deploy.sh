sudo docker-compose down --volumes --rmi
sudo docker rm -vf $(docker ps -aq)
sudo docker rmi -f $(docker images -aq)
sudo docker-compose rm -f
sudo docker-compose pull
sudo docker-compose build --no-cache
sudo docker-compose up