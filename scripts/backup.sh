#!/bin/sh

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S-%3N)

mkdir  /home/dev/backups/$TIMESTAMP
pg_dump -U postgres -Fc bp-strapi > /home/dev/backups/$TIMESTAMP/db_backup.sql

tar -cf /home/dev/backups/$TIMESTAMP/uploads.tar.gz /home/dev/BP2021RH1/projects/bp-strapi/public/uploads

find /home/dev/backups/* -mtime +14 -type d -exec rm -r {} +