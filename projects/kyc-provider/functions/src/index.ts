import { initializeApp, cert } from 'firebase-admin/app';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

initializeApp({
	credential: cert(resolve(__dirname, './service-account.json'))
});

export { firestoreBackup } from './firestore-backup/index.js';
export { onCreate as onCreateUser } from './users/controller.js';
export { getKycToken } from './get-kyc-token.js';
