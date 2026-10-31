#!/bin/bash
# Runs the Playwright tests against fresh stacks of their own, see docs/e2e.md.
# Arguments go to `playwright test`, e.g. compose/e2e.sh e2e/contact.spec.ts
cd "$(dirname "$0")/.."
prefix=${E2E_PROJECT:-bp-e2e}
cores=$(nproc)
# Half the cores, at most 5; one when running only some tests
stacks=$((cores / 2 < 1 ? 1 : cores / 2 > 5 ? 5 : cores / 2))
[ $# -eq 0 ] || stacks=1
stacks=${E2E_STACKS:-$stacks}
logs=/tmp/$prefix
projects=$(seq -f "$prefix-%g" 0 $((stacks - 1)))
# Read by docker-compose.e2e.yml and e2e/test.ts
export E2E_NETWORK=$prefix E2E_PROJECTS="${projects//$'\n'/ }"
compose() { docker compose -p "$1" -f docker-compose.yml -f docker-compose.e2e.yml "${@:2}"; }

remove_stacks() {
  for project in $projects; do
    compose "$project" down -v --remove-orphans > /dev/null 2>&1 &
  done
  wait
  docker network rm "$prefix" > /dev/null 2>&1
}

# Background jobs ignore SIGINT in scripts, so on an interrupt (e.g. a cancelled CI run) or a failed
# install stop them and remove the stacks
stop() { # exit status
  trap - INT TERM
  kill $(jobs -p) 2> /dev/null
  # Keeps the pnpm volume of the install project
  compose "$prefix" down --remove-orphans > /dev/null 2>&1
  remove_stacks
  exit "${1:-130}"
}
trap stop INT TERM

# Keeps a step's output in its log file and shows it live with a prefix
show() { tee "$1" | sed -u "s/^/[$2] /"; }
mkdir -p "$logs"
rm -f "$logs"/*.log
docker network inspect "$prefix" > /dev/null 2>&1 || docker network create "$prefix" > /dev/null

# Download the other images and start the services that don't need the install, while installing and building
{
  compose "$prefix" pull --policy missing postgres meilisearch mailpit s3 strapi playwright
  for project in $projects; do
    { compose "$project" down -v --remove-orphans &&
      compose "$project" up -d postgres meilisearch mailpit s3; } &
  done
  wait
} > "$logs/services.log" 2>&1 &
services=$!

# Install the gallery and build it while Strapi and its admin panel are installed and built and the stacks start;
# their gallery containers wait for build/.done (see docker-compose.e2e.yml)
step() { # name, commands
  compose "$prefix" run --rm --no-deps --entrypoint sh install -c "$2" 2>&1 | show "$logs/install-$1.log" "install $1"
  [ "${PIPESTATUS[0]}" -eq 0 ] || stop 1
}
step gallery '/repo/compose/install.sh bp-graphql bp-gallery && cd /repo/projects/bp-gallery &&
  rm -rf build test-results playwright-report blob-report'
compose "$prefix" run --rm --no-deps --entrypoint sh install -c 'cd /repo/projects/bp-gallery &&
  if pnpm vite build -m test; then touch build/.done; else mkdir -p build && touch build/.failed; fi' 2>&1 |
  show "$logs/build.log" build &
# URL=/ builds the admin panel with relative addresses, so it works under each stack's host name
step strapi '/repo/compose/install.sh bp-strapi && cd /repo/projects/bp-strapi && URL=/ pnpm build'
wait $services

pids=()
for project in $projects; do
  compose "$project" up -d --wait strapi gallery > "$logs/$project-start.log" 2>&1 &
  pids+=($!)
done
for pid in "${pids[@]}"; do wait "$pid" || { echo "A stack failed to start, see $logs/*-start.log"; stop 1; }; done

compose "$prefix" run --rm --no-deps playwright test "$@"
status=$?
if [ $status -ne 0 ]; then
  for project in $projects; do
    compose "$project" logs --no-color --timestamps > "$logs/$project-containers.log" 2>&1
  done
  [ -f projects/bp-gallery/test-results/failures.txt ] &&
    echo "Failed tests: projects/bp-gallery/test-results/failures.txt"
fi
[ -n "$E2E_KEEP" ] || remove_stacks
exit $status
