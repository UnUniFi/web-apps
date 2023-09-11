import { type Functions, httpsCallable } from 'firebase/functions';

export class FunctionsService {
	constructor(private functions: Functions) {}

	getKycToken(givenName: string, familyName: string, email: string) {
		return httpsCallable<{ givenName: string; familyName: string; email: string }, string>(
			this.functions,
			'getkyctoken'
		)({ givenName, familyName, email });
	}
}
