set -e
# pm2 restarts a Strapi that fails to start forever (max_restarts doesn't apply to an app reloaded
# by a deploy), so stop it and fail the deploy if it doesn't answer within 5 minutes.
app="Bad-Harzburg Archive Strapi Instance-$1"
port=$(grep -E '^PORT=' config/env/production/.env | cut -d= -f2)
for _ in $(seq 60); do
  if curl -s -o /dev/null "http://localhost:$port/"; then
    exit 0
  fi
  sleep 5
done
pnpm pm2 stop "$app"
echo "Strapi didn't start within 5 minutes, so $app was stopped; see its log with pm2 logs on the server"
exit 1
