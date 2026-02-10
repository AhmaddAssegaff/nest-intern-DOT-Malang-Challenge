#!/bin/bash
set -euo pipefail

ACTION=${1:-}
TARGET=${2:-}
ENV_FILE=${3:-".env"}

if [[ "$TARGET" == "--" ]]; then
  TARGET="${3:-}"
  ENV_FILE="${4:-.env}"
fi

usage() {
  echo "Usage:"
  echo "  ./scripts/migrate.sh up all"
  echo "  ./scripts/migrate.sh up users"
  echo "  ./scripts/migrate.sh down all"
  echo "  ./scripts/migrate.sh down blog"
  echo "  ./scripts/migrate.sh seed"
  exit 1
}

[ -z "$ACTION" ] && usage

if [[ "$ACTION" != "up" && "$ACTION" != "down" && "$ACTION" != "seed" ]]; then
  echo "❌ Invalid action: $ACTION"
  exit 1
fi

if [[ "$ACTION" != "seed" && -z "$TARGET" ]]; then
  echo "❌ Target is required (use 'all' or table name)"
  exit 1
fi

if [[ "$ACTION" == "down" && "$TARGET" == "all" ]]; then
  read -r -p "⚠️  DROP ALL TABLES? (y/N): " confirm
  [[ "$confirm" != "y" ]] && echo "❌ Aborted" && exit 1
fi

run_sql() {
  bash ./scripts/run-sql.sh "$1" "$ENV_FILE"
}

find_migrations() {
  local target="$1"
  local direction="$2" # up | down

  if [ "$target" = "all" ]; then
    mapfile -t FILES < <(
      find migrations -name "*.${direction}.sql" | sort
    )
  else
    mapfile -t FILES < <(
      find migrations -type d -name "*_${target}" \
        -exec find {} -name "*.${direction}.sql" \; |
        sort
    )
  fi

  if [ "${#FILES[@]}" -eq 0 ]; then
    echo "❌ No ${direction} migrations found for target: ${target}"
    echo "👉 Available targets:"
    ls migrations | sed 's/^[0-9]\+_table_//'
    exit 1
  fi

  printf "%s\n" "${FILES[@]}"
}

if [ "$ACTION" = "up" ]; then
  echo "🚀 Migration UP: $TARGET"

  if [ "$TARGET" = "all" ] && [ -f "migrations/init.sql" ]; then
    echo "⚙️  Running init.sql"
    run_sql "init.sql"
  fi

  if [ "$TARGET" = "all" ]; then
    find migrations -name '*.up.sql' | sort | while read -r file; do
      run_sql "${file#migrations/}"
    done
  else
    for file in $(find_migrations "$TARGET" "up"); do
      run_sql "${file#migrations/}"
    done
  fi
fi

if [ "$ACTION" = "down" ]; then
  echo "🔥 Migration DOWN: $TARGET"

  if [ "$TARGET" = "all" ]; then
    find migrations -name '*.down.sql' | sort -r | while read -r file; do
      run_sql "${file#migrations/}"
    done
  else
    for file in $(find_migrations "$TARGET" "down" | sort -r); do
      run_sql "${file#migrations/}"
    done
  fi
fi

if [ "$ACTION" = "seed" ]; then
  echo "🌱 Running SEED"

  if [ ! -d "migrations/99_seed" ]; then
    echo "⚠️  No seed directory found"
    exit 0
  fi

  find migrations/99_seed -name '*.sql' | sort | while read -r file; do
    run_sql "${file#migrations/}"
  done
fi
