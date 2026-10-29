#!/bin/bash
# Runs the Cypress tests against fresh stacks of their own, see docs/e2e.md.
# Without arguments, the spec files are split over $E2E_SHARDS stacks running in parallel.
# With arguments, one stack runs `cypress run` with them, e.g. compose/e2e.sh --spec cypress/e2e/contact.cy.ts
cd "$(dirname "$0")/.."
prefix=${E2E_PROJECT:-bp-e2e}
cores=$(nproc)
shards=${E2E_SHARDS:-$((cores / 2 < 1 ? 1 : cores / 2 > 5 ? 5 : cores / 2))}
logs=/tmp/$prefix
durations=$logs/durations
compose() { docker compose -p "$1" -f docker-compose.yml -f docker-compose.e2e.yml "${@:2}"; }

# Background jobs ignore SIGINT in scripts, so on an interrupt (e.g. a cancelled CI run) or a failed
# install stop them and remove all stacks
stop() { # exit status
  trap - INT TERM
  kill $(jobs -p) 2> /dev/null
  for project in "$prefix" $(seq -f "$prefix-%g" 0 $((shards - 1))); do
    compose "$project" down -v --remove-orphans > /dev/null 2>&1 &
  done
  wait
  exit "${1:-130}"
}
trap stop INT TERM

# Keeps a step's output in its log file and shows it live with a prefix
show() { tee "$1" | sed -u "s/^/[$2] /"; }
mkdir -p "$logs"
rm -f "$logs"/shard-*.status

# CI splits the specs over $E2E_RUNNERS machines, this one is number $E2E_RUNNER (from 0) and runs its
# share on $shards stacks. Longest specs first, each onto the stack with the least work so far, using
# the durations of the last run here, else those of a CI run in compose/e2e-durations (unknown specs count as 10 s)
runners=${E2E_RUNNERS:-1}
first=$((${E2E_RUNNER:-0} * shards))
declare -A seconds
while read -r s spec; do seconds[$spec]=$s; done < <(cat compose/e2e-durations "$durations" 2> /dev/null)
specs=()
while read -r _ spec; do specs+=("$spec"); done < <(
  cd projects/bp-gallery && find cypress/e2e -name '*.cy.ts' | sort | while read -r spec; do
    echo "${seconds[$spec]:-10} $spec"
  done | sort -rn -s -k1,1
)
declare -a load lists
for ((list = 0; list < runners * shards; list++)); do load[list]=0; lists[list]=; done
for spec in "${specs[@]}"; do
  min=0
  for ((list = 1; list < runners * shards; list++)); do ((load[list] < load[min])) && min=$list; done
  load[min]=$((load[min] + ${seconds[$spec]:-10}))
  lists[min]+="${lists[min]:+,}$spec"
done
stacks=()
if [ $# -gt 0 ]; then
  stacks=(0)
else
  for ((shard = 0; shard < shards; shard++)); do [ -n "${lists[first + shard]}" ] && stacks+=("$shard"); done
fi

# Download the other images and start the services that don't need the install, while installing and building
{
  compose "$prefix" pull --policy missing postgres meilisearch mailpit s3 cypress
  for shard in "${stacks[@]}"; do
    { compose "$prefix-$shard" down -v --remove-orphans &&
      compose "$prefix-$shard" up -d postgres meilisearch mailpit s3; } &
  done
  wait
} > "$logs/services.log" 2>&1 &
services=$!

# Install the gallery and build it while Strapi is installed and compiled and the stacks start;
# their gallery containers wait for build/.done (see docker-compose.e2e.yml)
cypress_cache=${E2E_CYPRESS_CACHE:-$HOME/.cache/bp-e2e-cypress}
mkdir -p "$cypress_cache"
step() { # name, commands
  compose "$prefix" run --rm --no-deps -v "$cypress_cache:/cypress-cache" -e CYPRESS_CACHE_FOLDER=/cypress-cache \
    -e CYPRESS_INSTALL_BINARY= --entrypoint sh install -c "$2" 2>&1 | show "$logs/install-$1.log" "install $1"
  [ "${PIPESTATUS[0]}" -eq 0 ] || stop 1
}
step gallery '/repo/compose/install.sh bp-graphql bp-gallery &&
  cd /repo/projects/bp-gallery && rm -rf build cypress/screenshots && node_modules/.bin/cypress install'
compose "$prefix" run --rm --no-deps --entrypoint sh \
  -e VITE_MEILISEARCH_HOST=http://meilisearch:7700 -e VITE_MEILISEARCH_API_KEY=local-dev-master-key \
  install -c 'cd /repo/projects/bp-gallery && if pnpm vite build -m test; then touch build/.done;
    else mkdir -p build && touch build/.failed; fi' 2>&1 | show "$logs/build.log" build &
step strapi '/repo/compose/install.sh bp-strapi && cd /repo/projects/bp-strapi && rm -rf dist && pnpm tsc'
wait $services

run_stack() { # project, cypress arguments...
  compose "$1" run --rm cypress run --config video=false,trashAssetsBeforeRuns=false "${@:2}"
  local status=$?
  [ $status -eq 0 ] || compose "$1" logs --no-color --timestamps > "$logs/$1-containers.log" 2>&1
  [ -n "$E2E_KEEP" ] || compose "$1" down -v > /dev/null 2>&1
  return $status
}

if [ $# -gt 0 ]; then
  run_stack "$prefix-0" "$@"
  status=$?
  wait
  exit $status
fi

pids=()
for shard in "${stacks[@]}"; do
  {
    run_stack "$prefix-$shard" --spec "${lists[first + shard]}"
    echo $? > "$logs/shard-$shard.status"
  } 2>&1 | show "$logs/shard-$shard.log" "stack $shard" &
  pids[shard]=$!
done

status=0
results=$(mktemp)
for shard in "${!pids[@]}"; do
  wait "${pids[shard]}"
  [ "$(cat "$logs/shard-$shard.status" 2> /dev/null)" = 0 ] || status=1
  echo "== shard $shard ($logs/shard-$shard.log)"
  sed 's/\x1b\[[0-9;]*m//g' "$logs/shard-$shard.log" | grep -E '^ +[│ ] +[✖✔] ' | sed 's/ \+[│ ]$//' |
    tee -a "$results"
done
wait
# A spec's duration is mm:ss, or NNms for specs without tests; Cypress cuts long names, so only full ones are kept
grep -E '│ +✔ +\S+\.cy\.ts +[0-9]' "$results" | awk '{
  t = $4; s = (t ~ /ms$/) ? 0 : substr(t, 1, 2) * 60 + substr(t, 4, 2); print s, "cypress/e2e/" $3
}' > "$durations.new"
# Keep the durations of specs this run didn't have, e.g. those of other CI runners
[ -f "$durations" ] && awk 'NR == FNR { seen[$2] = 1; print; next } !seen[$2]' "$durations.new" "$durations" \
  > "$durations.merged" && mv "$durations.merged" "$durations.new"
[ -s "$durations.new" ] && mv "$durations.new" "$durations"
rm -f "$results"
exit $status
