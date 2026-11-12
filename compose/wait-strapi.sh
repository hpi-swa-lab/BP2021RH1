#!/bin/sh
# Waits until the strapi container of the dev stack is ready, after `docker compose up -d` or
# `docker compose restart strapi`. Exits with 1 and prints the end of Strapi's log when Strapi
# stops or doesn't get ready within the time:
#   compose/wait-strapi.sh [seconds, default 600]
# Strapi's own restart after a change in src doesn't make the container unready, so this doesn't
# wait for that.
cd "$(dirname "$0")/.."
timeout=${1:-600}
container=$(docker compose ps -aq strapi)
[ -n "$container" ] || { echo 'There is no strapi container; start it with docker compose up -d'; exit 1; }
started=$(docker inspect -f '{{.State.StartedAt}}' "$container")
end=$(($(date +%s) + timeout))
while :; do
  state=$(docker compose ps -a strapi --format '{{.State}} {{.Health}}')
  case $state in
    'running healthy') exit 0 ;;
    running*) [ "$(date +%s)" -lt $end ] || { echo "Strapi isn't ready after ${timeout}s"; break; } ;;
    *) echo "Strapi stopped ($state)"; break ;;
  esac
  sleep 2
done
docker compose logs --since "$started" --no-log-prefix strapi 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g' | tail -30
exit 1
