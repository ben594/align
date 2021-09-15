#!/bin/bash

# remove old migrations versions
sudo rm -r migrations
psql amazon -c 'delete from alembic_version;'

source env/bin/activate
# apply changes to the database
flask db init
flask db migrate
flask db upgrade
