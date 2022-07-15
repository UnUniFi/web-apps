# Landing Page

## Directory

[https://github.com/UnUniFi/web-apps/tree/main/projects/landing-page-html](https://github.com/UnUniFi/web-apps/tree/main/projects/landing-page-html)

## Environments

| environment | url                                                              | branch          |
| ----------- | ---------------------------------------------------------------- | --------------- |
| alpha-test  | [https://alpha-test.ununifi.io/](https://alpha-test.ununifi.io/) | develop(latest) |
| beta-test   | [https://beta-test.ununifi.io/](https://beta-test.ununifi.io/)   | release(latest) |
| test        | [https://test.ununifi.io/](https://test.ununifi.io/)             | main(latest)    |
| main(beta)  | [https://ununifi.io/](https://ununifi.io/)                       | main            |

## Debug

### Open `index.html` in browser directly

Landing page is a simple HTML, CSS and JavaScript static web page.
You can open [https://github.com/UnUniFi/web-apps/blob/main/projects/landing-page-html/index.html](https://github.com/UnUniFi/web-apps/blob/main/projects/landing-page-html/index.html) with browser directly to debug.

### Use Node.js

You can check the interaction with all web-apps(= not only landing-page but also explorer and portal), with Node.js and Firebase Emulator.

1. Install Node.js. Currently, version 14 is recommended for this project.
2. `npm install` on repository root directory.
3. `npm run start:all` on repository root directory.
4. Open `http://127.0.0.1:5000/` with browser.
5. Now, you can debug all of web-apps at once.
