#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/run-sql.sh <sql-file-path> [env-file]"
  exit 1
fi

SQL_FILE="$1"
ENV_FILE=${2:-".env"}

if [ ! -f "$SQL_FILE" ]; then
  echo "SQL file not found: $SQL_FILE"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

echo "Running SQL file: $SQL_FILE with env: $ENV_FILE"

dotenv -e "$ENV_FILE" -- bash -c "docker exec -i postgres_intern_dot_malang psql -U \$DB_USER -d \$DB_NAME -f - < \"$SQL_FILE\""
