FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY service_registry.py .

# Expose the port defined by the SERVICE_REGISTRY_PORT environment variable
EXPOSE ${SERVICE_REGISTRY_PORT}

CMD [ "python", "service_registry.py" ]
