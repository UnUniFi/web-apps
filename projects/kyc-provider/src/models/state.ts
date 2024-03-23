import { getEvmWalletManager } from './evm-wallet';
import { getCosmosWalletManager } from './cosmos-wallet';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { FunctionsService } from './functions';
import { UserService } from './users/user.service';
import { AuthService } from './auth.service';
import { AddressProofService } from './users/address-proofs/address-proof.service';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

export const evmWalletManager = getEvmWalletManager();
export const cosmosWalletManager = getCosmosWalletManager();

const firebaseConfig = {
	apiKey: 'AIzaSyBqC5EbdZRY_GKSCoaJukIAqbfdZo_uOZI',
	authDomain: 'ununifi-kyc-dev.firebaseapp.com',
	projectId: 'ununifi-kyc-dev',
	storageBucket: 'ununifi-kyc-dev.appspot.com',
	messagingSenderId: '209822687319',
	appId: '1:209822687319:web:9ea3071e998050e4fb8312'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);

export const userService = new UserService(firestore);
export const addressProofService = new AddressProofService(firestore);
export const authService = new AuthService(auth, userService);
export const functionsService = new FunctionsService(functions);
