#! /bin/bash
date=$(date +%Y-%m-%d-%H:%M)
# -c Cleanup commands included
# -s schema only, no data

docker exec -t db pg_dumpall -c -s -U postgres > database/db-$date.sql
