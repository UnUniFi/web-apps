#!/bin/bash
cd ~/telescope
docker-compose down
docker pull ghcr.io/ununifi/explorer:test
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/explorer/editions/ununifi/launch/ununifi-7-private-test/docker-compose.yml
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/explorer/nginx.conf
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/explorer/editions/ununifi/launch/ununifi-7-private-test/full/config.js
docker-compose up -d
