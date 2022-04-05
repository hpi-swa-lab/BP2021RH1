#!/bin/bash

# Create and import data into test database
sudo -u postgres -- createdb -T template0 strapi-e2e
pg_restore -h localhost -c -U postgres --no-owner -d strapi-e2e ./test/data.sql

# Copy images to uploads folder
mkdir ./test/uploads
tar -xf ./test/uploads.tar.gz -C ./test/uploads
cp -n -R ./test/uploads/ ./public # n means don't override existing
rm -R ./test/uploads

# Setup strapi
yarn cross-env ENV_PATH=./test/test.env strapi develop &

# Wait for strapi to have started
until $(curl --output /dev/null --silent --head --fail http://localhost:9000); do
    printf '.'
    sleep 5
done

# Run cypress end to end
cd ../bp-gallery
mv ./src/graphql/schema/schema.json ./src/graphql/schema/_buffer.schema.json
yarn generate-api:e2e
yarn cy:ci
mv ./src/graphql/schema/_buffer.schema.json ./src/graphql/schema/schema.json

echo "Killing strapi service..."
pkill -f 'strapi develop'
