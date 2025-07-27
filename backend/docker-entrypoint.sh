#!/bin/bash

# Docker entrypoint script for Ordoc-AI Django Backend
set -e

# Function to wait for PostgreSQL
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    
    # Set connection parameters with defaults
    local db_host="${DB_HOST:-postgres}"
    local db_port="${DB_PORT:-5432}"
    local db_user="${DB_USER:-ordoc_user}"
    
    echo "Connecting to PostgreSQL at $db_host:$db_port as $db_user"
    
    until pg_isready -h "$db_host" -p "$db_port" -U "$db_user" >/dev/null 2>&1; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
    done
    
    echo "PostgreSQL is up and running!"
}

# Function to run Django management commands
run_django_setup() {
    echo "Running Django setup..."
    
    # Wait for database
    wait_for_postgres
    
    # Run migrations
    echo "Running database migrations..."
    python manage.py migrate --noinput
    
    # Create superuser if it doesn't exist
    echo "Creating superuser if needed..."
    python manage.py shell << EOF
from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser
import os

# Create superuser
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@ordoc.ai')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not User.objects.filter(username=username).exists():
    user = User.objects.create_superuser(username, email, password)
    # Create OrdocUser profile
    ordoc_user = OrdocUser.objects.create(
        user=user,
        status='active'
    )
    print(f'Superuser {username} created successfully!')
else:
    print(f'Superuser {username} already exists.')
EOF
    
    # Collect static files
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
    
    echo "Django setup completed!"
}

# Check if this is a management command
if [ "$1" = "manage.py" ]; then
    wait_for_postgres
    exec python "$@"
elif [ "$1" = "celery" ]; then
    # Celery worker or beat
    wait_for_postgres
    exec "$@"
elif [ "$1" = "bash" ] || [ "$1" = "sh" ]; then
    # Interactive shell
    exec "$@"
else
    # Default Django runserver
    run_django_setup
    exec "$@"
fi
