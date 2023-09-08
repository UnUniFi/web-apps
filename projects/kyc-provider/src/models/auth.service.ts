import {
	type Auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	getAdditionalUserInfo,
	type AuthProvider,
	type UserCredential
} from 'firebase/auth';
import type { UserService } from './users/user.service';

export class AuthService {
	constructor(private auth: Auth, private readonly userService: UserService) {}

	/**
	 * @param uniqueName
	 * @param provider
	 * @returns `Promise<UserCredential>`
	 * @throws SignUpError
	 */
	async signUp(
		provider: AuthProvider | { email: string; password: string }
	): Promise<UserCredential> {
		let credential: UserCredential;

		if ('email' in provider) {
			// Email and password
			credential = await createUserWithEmailAndPassword(
				this.auth,
				provider.email,
				provider.password
			);
		} else {
			// Popup
			credential = await signInWithPopup(this.auth, provider);
		}

		const info = getAdditionalUserInfo(credential);

		if (!info?.isNewUser) {
			// If this is not a first sign in (= not a sign up)
			console.error('This is not a first sign in. Please go to sign in page');
			await this.signOut();
			throw { code: 'ext/existing-user-signup' };
		}

		return credential;
	}

	/**
	 * @param provider
	 * @returns `Promise<UserCredential>`
	 * @throws SignInError
	 */
	async signIn(
		provider: AuthProvider | { email: string; password: string }
	): Promise<UserCredential> {
		let credential: UserCredential;

		if ('email' in provider) {
			// Email and password
			credential = await signInWithEmailAndPassword(this.auth, provider.email, provider.password);
		} else {
			// Popup
			credential = await signInWithPopup(this.auth, provider);
		}

		const info = getAdditionalUserInfo(credential);

		if (info?.isNewUser) {
			// If this is a first sign in (= a sign up)
			console.error('This is a first sign in. Please go to sign up page');
			await this.auth.currentUser?.delete();
			throw { code: 'ext/user-not-found' };
		}

		// Create User document on firestore
		await this.userService.create({
			auth_uid: credential.user.uid,
			name: credential.user.displayName || '',
			image_url: credential.user.photoURL || ''
		});

		return credential;
	}

	/**
	 *
	 */
	async signOut() {
		await this.auth.signOut();
	}
}
