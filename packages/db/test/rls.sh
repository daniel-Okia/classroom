#!/bin/zsh
# Usage: PGPORT-less; expects a disposable Postgres on 127.0.0.1:54329 (superuser "dev", trust auth). Creates and leaves DB classroom_test.

export PATH=/Library/PostgreSQL/18/bin:$PATH
M=$(cd "$(dirname "$0")/../migrations" && pwd)
p() { psql -h 127.0.0.1 -p 54329 -v ON_ERROR_STOP=1 -q "$@"; }
p -U dev -d postgres -c 'create database classroom_test' || exit 1
p -U dev -d classroom_test -f $M/0000_nosy_giant_man.sql 2>&1 | grep -v NOTICE | tail -3
p -U dev -d classroom_test -f $M/rls.sql
p -U dev -d classroom_test <<'SQL'
create role app_user login nosuperuser;
grant all on all tables in schema public to app_user;
insert into school (id,name,district,level_from,level_to,contact_phone,qr_token_hash,join_code) values
 ('11111111-1111-1111-1111-111111111111','A','Kampala','P1','S6','+256700000001','h1','AAAA-AAAA'),
 ('22222222-2222-2222-2222-222222222222','B','Gulu','P1','S6','+256700000002','h2','BBBB-BBBB');
insert into class (school_id,name,level,join_code) values
 ('11111111-1111-1111-1111-111111111111','S4 East','S4','C1'),
 ('22222222-2222-2222-2222-222222222222','S4 West','S4','C2');
SQL
echo "--- school A session sees:"
p -U app_user -d classroom_test -t -c "begin; set local app.school_id='11111111-1111-1111-1111-111111111111'; select name from class; commit;"
echo "--- no school set sees (expect 0):"
p -U app_user -d classroom_test -t -c "select count(*) from class"
echo "--- cross-school insert (expect error):"
p -U app_user -d classroom_test -c "begin; set local app.school_id='11111111-1111-1111-1111-111111111111'; insert into class (school_id,name,level,join_code) values ('22222222-2222-2222-2222-222222222222','x','S1','C9'); commit;" 2>&1 | tail -1
echo "--- every table with school_id has RLS enabled (expect 0 rows):"
p -U dev -d classroom_test -t -c "select c.table_name from information_schema.columns c join pg_class k on k.relname=c.table_name where c.table_schema='public' and c.column_name='school_id' and c.table_name<>'school_settings' and not k.relrowsecurity"
