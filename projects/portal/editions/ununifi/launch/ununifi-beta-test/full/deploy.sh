#!/bin/bash
cd ~/portal
docker-compose down
docker pull ghcr.io/ununifi/portal:test
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/portal/editions/ununifi/launch/ununifi-8-private-test/docker-compose.yml
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/portal/nginx.conf
curl -O https://raw.githubusercontent.com/UnUniFi/utils/develop/projects/portal/editions/ununifi/launch/ununifi-8-private-test/full/config.js
docker-compose up -d
