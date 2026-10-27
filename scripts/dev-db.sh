#!/bin/zsh
# Disposable local Postgres on 127.0.0.1:54329 without Docker. `scripts/dev-db.sh start|stop|reset`.
# With Docker use `docker compose up -d postgres` instead (same port).
export PATH=/Library/PostgreSQL/18/bin:/opt/homebrew/bin:$PATH
ROOT=$(cd "$(dirname "$0")/.." && pwd); D=$ROOT/.dev/pg; SOCK=/tmp/classroom-pg
p() { psql -h 127.0.0.1 -p 54329 -v ON_ERROR_STOP=1 -q "$@"; }
case "$1" in
  start)
    [ -d $D ] || { mkdir -p $ROOT/.dev; initdb -D $D -U dev --auth=trust -E UTF8 >/dev/null; }
    mkdir -p $SOCK; pg_ctl -D $D -o "-p 54329 -k $SOCK -c listen_addresses=127.0.0.1" -l $ROOT/.dev/pg.log -w start >/dev/null
    p -U dev -d postgres -tc "select 1 from pg_database where datname='classroom'" | grep -q 1 || { p -U dev -d postgres -c 'create database classroom'; MIGRATE=1; }
    [ -n "$MIGRATE" ] && { for f in $ROOT/packages/db/migrations/0*.sql; do p -U dev -d classroom -f $f 2>&1 | grep -v NOTICE; done
      p -U dev -d classroom -f $ROOT/packages/db/migrations/rls.sql 2>&1 | grep -v NOTICE
      p -U dev -d classroom -c "create role app_user login nosuperuser" -c "grant all on all tables in schema public to app_user"; }
    echo "postgres://app_user@127.0.0.1:54329/classroom";;
  stop) pg_ctl -D $D stop -m fast;;
  reset) pg_ctl -D $D stop -m fast 2>/dev/null; rm -rf $D; $0 start;;
esac
