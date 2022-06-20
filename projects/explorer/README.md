# Explorer

## Directory

[https://github.com/UnUniFi/web-apps/tree/main/projects/explorer](https://github.com/UnUniFi/web-apps/tree/main/projects/explorer)

## Environments

| environment | url | branch |
| - | - | - |
| alpha-test | [https://alpha-test.ununifi.io/explorer/](https://alpha-test.ununifi.io/explorer/) | develop(latest) |
| beta-test | [https://beta-test.ununifi.io/explorer/](https://beta-test.ununifi.io/explorer/) | release(latest) |
| test | in preparation | main(latest) |
| main(beta) | [https://ununifi.io/explorer/](https://ununifi.io/explorer/) | main |

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

### Debug Only Explorer

You can debug only explorer with the following command.

```bash
npm run start:explorer
```

In this way, hot reloading is enabled.

### Debug With All Web Apps

You can debug with all web-apps(= not only explorer but also landing-page and portal)

```bash
npm run start:all
```

Be careful hot reloading is not enabled in this way.

## FAQ

Q. What settings are used for debugging? (ex. node, faucet, chain-id, bech32prefix, gas, etc.)
A. By default, alpha-test settings are used. See the following link for details. Of course you can change it for debugging but, do not commit the changes for debug only purpose.

[https://github.com/UnUniFi/web-apps/blob/main/projects/explorer/src/assets/config.js](https://github.com/UnUniFi/web-apps/blob/main/projects/explorer/src/assets/config.js)
