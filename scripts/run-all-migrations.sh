#!/bin/bash

echo " Running DB migrations"

bash ./scripts/run-sql.sh init.sql

find ./migrations -name '*.up.sql' | sort | while read -r file; do
  relative_path="${file#./migrations/}"
  echo "Running $relative_path"
  bash ./scripts/run-sql.sh "$relative_path"
done
