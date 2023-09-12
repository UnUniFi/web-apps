import { auth } from '../models/state';

export async function guard() {
	await auth.authStateReady();
	if (auth.currentUser === null && !location.href.includes('/auth')) {
		location.href = '/auth/sign-in';
	}
}
