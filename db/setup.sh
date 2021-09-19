#!/bin/bash

mypath=`realpath $0`
mybase=`dirname $mypath`
cd $mybase

source ../.flaskenv
dbname=$DB_NAME

if [[ -n `psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    dropdb $dbname
fi
createdb $dbname

psql -af create.sql $dbname
psql -af load.sql $dbname
