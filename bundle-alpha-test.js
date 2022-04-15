const fse = require("fs-extra");

fse.copySync("dist/explorer", "dist/landing-page/explorer");
fse.copySync("dist/portal", "dist/landing-page/portal");

fse.copyFileSync("projects/explorer/editions/ununifi/launch/ununifi-alpha-test/firebase-hosting/config.js", "dist/landing-page/explorer/assets/config.js");
fse.copyFileSync("projects/portal/editions/ununifi/launch/ununifi-alpha-test/firebase-hosting/config.js", "dist/landing-page/portal");
