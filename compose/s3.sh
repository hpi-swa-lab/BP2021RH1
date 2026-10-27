#!/bin/sh
# Starts SeaweedFS with its S3 API and creates the bucket Strapi uploads to.
# The healthcheck in docker-compose.yml waits for /tmp/ready.
set -e
weed server -dir=/data -s3 -s3.config=/etc/seaweedfs/s3.json &
server=$!
trap 'kill $server' TERM INT
until echo "s3.bucket.list" | weed shell -master=localhost:9333 > /tmp/buckets 2>&1; do sleep 1; done
grep -q "bp-uploads" /tmp/buckets || echo "s3.bucket.create -name bp-uploads" | weed shell -master=localhost:9333
touch /tmp/ready
wait $server
