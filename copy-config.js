const fs = require('fs');

const versionName = process.argv[2];

const srcExplorerConfigFilePath = `projects/explorer/editions/ununifi/launch/${versionName}/firebase-hosting/config.js`;
const srcPortalConfigFilePath = `projects/portal/editions/ununifi/launch/${versionName}/firebase-hosting/config.js`;

fs.copyFileSync(srcExplorerConfigFilePath, 'dist/landing-page/explorer/assets/config.js');
fs.copyFileSync(srcPortalConfigFilePath, 'dist/landing-page/portal/assets/config.js');
