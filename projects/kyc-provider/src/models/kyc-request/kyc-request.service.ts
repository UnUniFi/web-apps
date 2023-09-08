import { type IKycRequest, KycRequest } from './kyc-request';
import { KycRequestFirestore } from './kyc-request.firestore';
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

export class KycRequestService {
	constructor(private readonly firestore: Firestore) {}

	collection() {
		const ref = collection(this.firestore, KycRequestFirestore.collectionPath());

		return ref.withConverter(KycRequestFirestore.converter);
	}

	collectionQuery(queryConstraints: QueryConstraint[]) {
		const ref = collection(this.firestore, KycRequestFirestore.collectionPath());

		return query(ref, ...queryConstraints).withConverter(KycRequestFirestore.converter);
	}

	collectionGroup() {
		const ref = collectionGroup(this.firestore, KycRequestFirestore.collectionId);

		return ref.withConverter(KycRequestFirestore.converter);
	}

	collectionGroupQuery(queryConstraints: QueryConstraint[]) {
		const ref = collectionGroup(this.firestore, KycRequestFirestore.collectionId);

		return query(ref, ...queryConstraints).withConverter(KycRequestFirestore.converter);
	}

	document(id: string) {
		const ref = collection(this.firestore, KycRequestFirestore.collectionPath());

		return doc(this.firestore, ref.path, id).withConverter(KycRequestFirestore.converter);
	}

	get(id: string) {
		return getDoc(this.document(id)).then((snapshot) => snapshot.data() as KycRequest);
	}

	list() {
		return getDocs(this.collection()).then((snapshots) =>
			snapshots.docs.map((doc) => doc.data() as KycRequest)
		);
	}

	listGroup() {
		return getDocs(this.collectionGroup()).then((snapshots) =>
			snapshots.docs.map((doc) => doc.data() as KycRequest)
		);
	}

	async create(data: IKycRequest) {
		const now = serverTimestamp();

		const user = new KycRequest(data.name, now as any, now as any);

		const doc = await addDoc(this.collection(), user);

		return doc.id;
	}
}
