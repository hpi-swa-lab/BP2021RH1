#!/bin/bash
# This file has to be executed from the bp-strapi root directory

# Create and import data into test database
# The test data is located in the ./e2e/data.sql file
# and was exported via pg_dump
createdb -h localhost -U postgres -T template0 strapi-e2e
pg_restore -h localhost -c -U postgres --no-owner -d strapi-e2e ./e2e/data.sql

# Copy images to uploads folder
# using ./test/uploads as a temp folder
mkdir ./e2e/uploads
tar -xf ./e2e/uploads.tar.gz -C ./e2e/uploads # tar contains 5 pictures
cp -n -R ./e2e/uploads/ ./public # n means don't override existing files
rm -R ./e2e/uploads # remove temp folder

# Setup strapi using test environment
yarn cross-env ENV_PATH=./e2e/test.env strapi develop &

# Wait for strapi to have started by "pinging" port 9000
until $(curl --output /dev/null --silent --head --fail http://localhost:9000); do
    printf '.'
    sleep 5
done

# Run cypress end to end
cd ../bp-gallery

# Backup (non-test) schema so as to not mess with prod data
mv ./src/graphql/schema/schema.json ./src/graphql/schema/_buffer.schema.json
yarn generate-api:e2e # generate api from local schema
yarn cy:ci # run cypress tests

status_code=$?

mv ./src/graphql/schema/_buffer.schema.json ./src/graphql/schema/schema.json #restore (non-test) schema

# Clean up
echo "Killing strapi service..."
pkill -f 'strapi develop'

exit $status_code
