FROM python:3.9-slim
RUN apt-get -y install rsyslog

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt --cache-dir /pip-cache

COPY . .


EXPOSE 8000
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8087"]

