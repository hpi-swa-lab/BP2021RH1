#!/bin/sh

############ VARIABLE DEFINITIONS ############
BACKUP_DIR=/home/dev/backups/
MEDIA_DIR=/home/dev/BP2021RH1/projects/bp-strapi/public/uploads
DB_NAME=bp-strapi
DB_USER=postgres
##############################################


############ CODE ############
# Find the last backup, if none exists, it will just continue to make a full backup
LAST_BACKUP_DIR=$(ls -td -- "$BACKUP_DIR"* | head -n 1)

echo "last backup is placed in directory $LAST_BACKUP_DIR"

# Create new directory for backup placement
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S-%3N)
BACKUP_TARGET="$BACKUP_DIR$TIMESTAMP"
mkdir $BACKUP_TARGET

# Dump contents of the database
pg_dump -U $DB_USER -Fc $DB_NAME > "$BACKUP_TARGET/db_backup.sql"

# Sync picture files using incremental backup system to backup directory
rsync -a -v --delete --link-dest=$LAST_BACKUP_DIR $MEDIA_DIR $BACKUP_TARGET

# Delete stale (> 14 days old) backups
find "$BACKUP_DIR"* -mtime +14 -type d -exec rm -r {} +
##############################################
