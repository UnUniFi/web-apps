import { isTriggeredOnce } from '../triggers/module.js';
import { IUserStore, UserFirestore } from '@local/common';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { userModule } from './index.js';

export const onCreate = onDocumentCreated(
	{ document: UserFirestore.virtualPath },
	async (event) => {
		if (await isTriggeredOnce(event.id)) {
			return;
		}

		const user = event.data?.data() as IUserStore;
		const id = event.params.user_id;

		await userModule
			.document(id)
			.collection('auth_uid_maps')
			.doc(user.auth_uid)
			.set({ user_id: id });
	}
);
