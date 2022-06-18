#!/bin/bash
cd ~/marketplace
docker-compose down
docker pull ghcr.io/ununifi/marketplace:test
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/marketplace/editions/ununifi/launch/ununifi-8-private-test/docker-compose.yml
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/marketplace/nginx.conf
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/marketplace/editions/ununifi/launch/ununifi-8-private-test/full/config.js
docker-compose up -d
