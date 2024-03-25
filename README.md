# UnUniFi Web Apps

## Landing Page

[https://github.com/UnUniFi/web-apps/tree/main/projects/landing-page-html](https://github.com/UnUniFi/web-apps/tree/main/projects/landing-page-html)

## Explorer

[https://github.com/UnUniFi/web-apps/tree/main/projects/explorer](https://github.com/UnUniFi/web-apps/tree/main/projects/explorer)

## Portal

[https://github.com/UnUniFi/web-apps/tree/main/projects/portal](https://github.com/UnUniFi/web-apps/tree/main/projects/portal)

## Develop

```bash
npm i
npm run [command]
```

| Command              | Description                  |
| :------------------- | :--------------------------- |
| start:portal         | Run Portal via http          |
| start:portal:https   | Run Portal via https (SSL)   |
| start:explorer       | Run Explorer via http        |
| start:explorer:https | Run Explorer via https (SSL) |
| start:landing-page   | Run Landing Page             |

other options are available in package.json

### SSL

A certificate is required for development on HTTPS

```bash
$ openssl genrsa -out ssl/server.key 2048

$ ls ssl/
server.key

$ openssl req -new -key ssl/server.key -out ssl/server.csr

$ ls ssl/
server.csr server.key

$ openssl x509 -days 365 -req -signkey ssl/server.key -in ssl/server.csr -out ssl/server.crt
Signature ok

$ ls ssl/
server.crt server.csr server.key
```
