# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema para MySQL client e compilação
RUN apt-get update && apt-get install -y gcc libmariadb-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install --with-deps chromium

COPY . .

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]