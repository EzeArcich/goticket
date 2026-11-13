#!/usr/bin/env bash
set -euo pipefail

# Cluster efímero independiente. Nunca administra la instancia del sistema.
pg_bin="${PG_BIN:-$(pg_config --bindir)}"
test_tmp="$(mktemp -d /tmp/goticket-pg-test.XXXXXX)"
test_port="${TEST_POSTGRES_PORT:-55453}"
cleanup() {
  if [[ -f "$test_tmp/data/postmaster.pid" ]]; then
    "$pg_bin/pg_ctl" -D "$test_tmp/data" -m fast -w stop >/dev/null
  fi
  rm -rf -- "${test_tmp:?}"
}
trap cleanup EXIT
node -e 'require("node:fs").writeFileSync(process.argv[1],require("node:crypto").randomBytes(24).toString("hex"),{mode:0o600})' "$test_tmp/password"
"$pg_bin/initdb" -D "$test_tmp/data" -U goticket_test_owner --auth-local=trust --auth-host=scram-sha-256 --pwfile="$test_tmp/password" >/dev/null
"$pg_bin/pg_ctl" -D "$test_tmp/data" -l "$test_tmp/postgres.log" -o "-h 127.0.0.1 -p $test_port -k $test_tmp" -w start >/dev/null
"$pg_bin/createdb" -h "$test_tmp" -p "$test_port" -U goticket_test_owner goticket_test
TEST_DATABASE_URL="postgresql://goticket_test_owner:$(cat "$test_tmp/password")@127.0.0.1:$test_port/goticket_test?schema=public" pnpm test:integration
