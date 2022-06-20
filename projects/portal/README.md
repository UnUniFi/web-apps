# Portal

## Directory

[https://github.com/UnUniFi/web-apps/tree/main/projects/portal](https://github.com/UnUniFi/web-apps/tree/main/projects/portal)

## Environments

| environment | url | branch |
| - | - | - |
| alpha-test | [https://alpha-test.ununifi.io/portal/](https://alpha-test.ununifi.io/portal/) | develop(latest) |
| beta-test | [https://beta-test.ununifi.io/portal/](https://beta-test.ununifi.io/portal/) | release(latest) |
| test | in preparation | main(latest) |
| main(beta) | [https://ununifi.io/portal/](https://ununifi.io/portal/) | main |

## Setup

### Install Node.js

[https://nodejs.org/](https://nodejs.org/)

### Install all dependencies

This project uses the following frameworks or tools.

- This project was generate with [Angular](https://angular.io/).
- This project uses the npm package [@cosmos-client/core](https://www.npmjs.com/package/@cosmos-client/core) as the client library for the Cosmos SDK blockchain.
- This project uses [Angular Material](https://material.angular.io/) and [Tailwind CSS](https://tailwindcss.com/).
- This project is deployed to [Firebase Hosting](https://firebase.google.com/docs/hosting).

Execute the following command in the root directory of this repository.

```bash
npm install
```

## Debug

### Debug Only Portal

You can debug only Portal with the following command.

```bash
npm run start:portal
```

In this way, hot reloading is enabled.

### Debug With All Web Apps

You can debug with all web-apps(= not only portal but also landing-page and explorer)

```bash
npm run start:all
```

Be careful hot reloading is not enabled in this way.

## FAQ

Q. What settings are used for debugging? (ex. node, faucet, chain-id, bech32prefix, gas, etc.)
A. By default, alpha-test settings are used. See the following link for details. Of course you can change it for debugging but, do not commit the changes for debug only purpose.

[https://github.com/UnUniFi/web-apps/blob/main/projects/portal/src/assets/config.js](https://github.com/UnUniFi/web-apps/blob/main/projects/portal/src/assets/config.js)
