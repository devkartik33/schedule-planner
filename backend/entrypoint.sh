#!/bin/bash
set -e

echo "Starting application..."

# Проверяем наличие alembic.ini
if [ -f "alembic.ini" ]; then
    echo "Running Alembic migrations..."
    alembic upgrade head
    echo "Migrations completed successfully"
else
    echo "Warning: alembic.ini not found, skipping migrations"
fi

# Запускаем приложение
echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload