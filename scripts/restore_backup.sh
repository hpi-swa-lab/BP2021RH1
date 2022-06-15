#!/bin/sh


############ VARIABLE DEFINITIONS ############
MEDIA_DIR=/home/github/BP2021RH1/source/projects/bp-strapi/public/uploads
DB_NAME=bp-strapi
##############################################

############ CODE ############
# Make path absolute just to be safe
DIRECTORY="$(cd "$(dirname "$1")"; pwd -P)/$(basename "$1")"

if [ -d "$DIRECTORY" ]; then
  echo "Installing backup from ${DIRECTORY}..."
  DUMP_PATH="$DIRECTORY/db_backup.sql"
  MEDIA_PATH="$DIRECTORY/uploads/"
  if [ ! -f "$DUMP_PATH" ]; then
    echo "Error: Could not find dump file at $DUMP_PATH. Aborting backup restore."
    exit 1
  fi
  if [ ! -d "$MEDIA_PATH" ]; then
    echo "Error: Could not find uploads folder at $MEDIA_PATH. Aborting backup restore."
    exit 1
  fi

  # Import db dump
  sudo createdb $DB_NAME
  sudo pg_restore -d $DB_NAME $DUMP_PATH

  # Copy files to uploads folder
  find $MEDIA_PATH -name '*.*' -exec cp {} $MEDIA_DIR \;
else
  echo "Error: ${DIRECTORY} not found. Cannot restore backup."
  exit 1
fi
##############################################
