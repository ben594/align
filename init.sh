#!/bin/bash
sudo apt update
sudo apt install postgresql postgresql-contrib

sudo -u postgres psql postgres -c '\password'


dbname=amazon

if [[ -n `sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    sudo -u postgres dropdb $dbname
fi
sudo -u postgres createdb $dbname

