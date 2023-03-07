#!/bin/sh
script_location="$(dirname $(realpath $0))"
sudo -u postgres pg_restore -c -d strapi-e2e -O -U postgres  < "$script_location/data.sql"
