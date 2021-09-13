#!/bin/bash
sudo apt update
sudo apt install postgresql postgresql-contrib

dbname=amazon

if [[ -n `psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    dropdb $dbname
fi
createdb $dbname

