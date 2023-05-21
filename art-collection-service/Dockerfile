FROM python:3.9-slim
RUN apt-get -y install rsyslog

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt --cache-dir /pip-cache

COPY . .
ARG DATABASE_HOST_URL
# RUN sed 's/substring-to-replace/${DATABASE_HOST_URL}/g' alembic.ini.template > alembic.ini
# RUN sed -i "s|{{{DATABASE_HOST_URL}}}|$(echo ${NEW_SUBSTRING} | sed 's/\//\\\//g')|g" alembic.ini.template && mv alembic.ini.template alembic.ini



# RUN python alembic_config.py ${DATABASE_HOST_URL}
# RUN alembic upgrade head


EXPOSE 8000
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8086"]
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8086"]
