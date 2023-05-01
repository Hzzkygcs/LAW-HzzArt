docker-compose down --volumes --rmi
docker-compose rm -f
docker-compose pull
docker-compose build --no-cache
