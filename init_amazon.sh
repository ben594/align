#!/bin/bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Remove this block if you don't want to use venv
sudo apt install python3.8-venv
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

# This process is interactive, you need to enter a password same as the one in config.py
sudo -u postgres psql postgres -c '\password'

# create the database
dbname=amazon
if [[ -n `sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    sudo -u postgres dropdb $dbname
fi
sudo -u postgres createdb $dbname

source env/bin/activate
flask db init
flask db migrate
flask db upgrade

# populate the database with initial data
