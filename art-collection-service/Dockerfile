FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt --cache-dir /pip-cache
RUN alembic upgrade 78f
RUN alembic upgrade 914

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8086"]
