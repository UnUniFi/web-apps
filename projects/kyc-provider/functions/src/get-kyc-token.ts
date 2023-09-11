import { onCall } from 'firebase-functions/v2/https';
import { complyCubeApiKey } from './config';
import { ComplyCube } from '@complycube/api';
import admin from 'firebase-admin';
import { userModule } from './users';

export const getKycToken = onCall<
	{ givenName: string; familyName: string },
	Promise<string | null>
>({ secrets: [complyCubeApiKey] }, async (request) => {
	const uid = request.auth?.uid;
	if (!uid) {
		return null;
	}
	const userId = await userModule.userIdByAuthUid(uid);
	if (!userId) {
		return null;
	}

	const user = await userModule.get(userId);
	if (!user) {
		return null;
	}

	const complyCube = new ComplyCube({ apiKey: complyCubeApiKey.value() });

	if (!user.client_id) {
		const authUser = await admin.auth().getUser(uid);

		const client = await complyCube.client.create({
			type: 'person',
			email: authUser.email,
			personDetails: {
				firstName: request.data.givenName,
				lastName: request.data.familyName
			}
		});

		await userModule.update(userId, { client_id: client.id });
		user.client_id = client.id;
	}

	const token = await complyCube.token.generate(user.client_id, {});

	return token.token;
});
