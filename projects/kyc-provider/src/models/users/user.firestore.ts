import { type IUserStore, User } from './user';
import { type FirestoreDataConverter, Timestamp } from 'firebase/firestore';

export class UserFirestore {
	static collectionId = 'users';
	static documentId = 'user_id';
	static virtualPath = `${UserFirestore.collectionId}/{${UserFirestore.documentId}}`;

	static converter: FirestoreDataConverter<User> = {
		toFirestore: (data: User) => ({
			...data.dropRedundancy(),
			created_at:
				data.created_at instanceof Date ? Timestamp.fromDate(data.created_at) : data.created_at,
			updated_at:
				data.updated_at instanceof Date ? Timestamp.fromDate(data.updated_at) : data.updated_at
		}),
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options) as IUserStore;
			return new User(
				snapshot.id,
				data.auth_uid,
				data.name,
				data.image_url,
				data.created_at.toDate(),
				data.updated_at.toDate()
			);
		}
	};

	static collectionPath() {
		return `${UserFirestore.collectionId}`;
	}

	static documentPath(id: string) {
		return `${UserFirestore.collectionPath()}/${id}`;
	}
}
