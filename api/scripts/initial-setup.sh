#! /bin/bash

LATEST=./database/$(ls -t ./database/ | head -1)
DATABASE=postgres
DB_HOST=db
DB_USER=postgres
echo $LATEST # A quick sanity check

# To Seed the DB
cat $LATEST | docker exec -i $DB_HOST psql -U $DB_USER
