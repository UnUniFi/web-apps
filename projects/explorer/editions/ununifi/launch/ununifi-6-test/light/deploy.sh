#!/bin/bash
cd ~/telescope
docker-compose down
docker pull ghcr.io/ununifi/explorer:latest
curl -O https://raw.githubusercontent.com/UnUniFi/web-apps/main/projects/explorer/editions/ununifi/launch/ununifi-6-test/docker-compose.yml
curl -O https://raw.githubusercontent.com/UnUniFi/web-apps/main/projects/explorer/nginx.conf
curl -O https://raw.githubusercontent.com/UnUniFi/web-apps/main/projects/explorer/editions/ununifi/launch/ununifi-6-test/light/config.js
docker-compose up -d
