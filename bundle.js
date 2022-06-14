const fse = require("fs-extra");

fse.copySync("dist/shared", "dist/landing-page/shared");
fse.copySync("dist/explorer", "dist/landing-page/explorer");
fse.copySync("dist/portal", "dist/landing-page/portal");
fse.copySync("dist/marketplace", "dist/landing-page/marketplace");
