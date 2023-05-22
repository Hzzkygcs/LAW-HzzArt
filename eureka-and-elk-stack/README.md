Karena ELK stack dan Eureka merupakan konfigurasi yang terpusat, maka konfigurasi docker-compose untuk kedua hal ini perlu dilakukan secara terpisah. 

Folder ini terdiri atas 2 bagian, yakni `eureka-and-elk-stack` dan `navigator-server`.  

- `eureka-and-elk-stack` akan di-host pada GCP terpisah yang mana pada saat PRODUCTION akan selalu diaktifkan. 
  Folder ini akan memiliki konfigurasi terkait Consul server (service registry) dan database mongodb.
  Database postgresql di-host terpisah pada Supabase.
- `navigator-server`: navigator server digunakan untuk menunjukkan alamat dari `eureka-and-elk-stack`. Karena GCP memerlukan biaya tambahan untuk static IP dan keterbatasan GCP credits, kami perlu mempertimbangkan kasus ketika kami terpaksa mengganti IP address karena masalah biaya ataupun alasan-alasan lainnya. Oleh karena itu kami membuat `navigator-server` yang akan dihosting menggunakan Heroku (versi gratis karena ada Heroku Student). Server ini akan digunakan untuk memberikan alamat dari GCP `eureka-and-elk-stack` secara dinamis, di mana kami dapat mengganti alamat dari GCP tersebut setiap saat melalui environment variablenya.
