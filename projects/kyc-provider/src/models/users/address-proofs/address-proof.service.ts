import { type IAddressProof, AddressProof, AddressProofFirestore } from '@local/common';
import {
	Firestore,
	collection,
	collectionGroup,
	query,
	QueryConstraint,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	addDoc
} from 'firebase/firestore';

export class AddressProofService {
	constructor(private readonly firestore: Firestore) {}

	collection(userId: string) {
		const ref = collection(this.firestore, AddressProofFirestore.collectionPath(userId));

		return ref.withConverter(AddressProofFirestore.converter);
	}

	collectionQuery(userId: string, queryConstraints: QueryConstraint[]) {
		const ref = collection(this.firestore, AddressProofFirestore.collectionPath(userId));

		return query(ref, ...queryConstraints).withConverter(AddressProofFirestore.converter);
	}

	collectionGroup() {
		const ref = collectionGroup(this.firestore, AddressProofFirestore.collectionId);

		return ref.withConverter(AddressProofFirestore.converter);
	}

	collectionGroupQuery(queryConstraints: QueryConstraint[]) {
		const ref = collectionGroup(this.firestore, AddressProofFirestore.collectionId);

		return query(ref, ...queryConstraints).withConverter(AddressProofFirestore.converter);
	}

	document(userId: string, id: string) {
		const ref = collection(this.firestore, AddressProofFirestore.collectionPath(userId));

		return doc(this.firestore, ref.path, id).withConverter(AddressProofFirestore.converter);
	}

	get(userId: string, id: string) {
		return getDoc(this.document(userId, id)).then((snapshot) => snapshot.data() as AddressProof);
	}

	list(userId: string) {
		return getDocs(this.collection(userId)).then((snapshots) =>
			snapshots.docs.map((doc) => doc.data() as AddressProof)
		);
	}

	listGroup() {
		return getDocs(this.collectionGroup()).then((snapshots) =>
			snapshots.docs.map((doc) => doc.data() as AddressProof)
		);
	}

	async create(data: IAddressProof) {
		const now = serverTimestamp();

		const user = new AddressProof(
			'',
			data.user_id,
			data.address,
			data.message_hex,
			data.signature_hex,
			now as any,
			now as any
		);

		const doc = await addDoc(this.collection(data.user_id), user);

		return doc.id;
	}
}
