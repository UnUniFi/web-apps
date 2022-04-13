const fse = require("fs-extra");

fse.copySync("dist/explorer", "dist/landing-page/explorer");
fse.copySync("dist/portal", "dist/landing-page/portal");
