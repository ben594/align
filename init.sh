#!/bin/bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Uncomment this if using venv
# sudo apt install python3.8-venv
# python3 -m venv env
# source env/bin/activate
# pip install -r requirements.txt

# This process is interactive, you need to enter a password same as the one in config.py
sudo -u postgres psql postgres -c '\password'


dbname=amazon

if [[ -n `sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w "$dbname"` ]]; then
    sudo -u postgres dropdb $dbname
fi
sudo -u postgres createdb $dbname

