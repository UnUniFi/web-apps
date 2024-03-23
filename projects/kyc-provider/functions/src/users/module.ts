import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { IUserStore, User, UserFirestore } from '@local/common';

export function collection() {
	return getFirestore()
		.collection(UserFirestore.collectionPath())
		.withConverter(UserFirestore.converter as any);
}

export function collectionGroup() {
	return getFirestore()
		.collectionGroup(UserFirestore.collectionId)
		.withConverter(UserFirestore.converter as any);
}

export function document(id: string) {
	const col = collection();
	return id ? col.doc(id) : col.doc();
}

export async function get(id: string) {
	return await document(id)
		.get()
		.then((snapshot) => snapshot.data() as User | undefined);
}

export async function create(data: User) {
	const doc = document('');
	data.id = doc.id;

	const now = FieldValue.serverTimestamp();
	data.created_at = now as any;
	data.updated_at = now as any;

	await doc.set(data);
}

export async function set(data: User) {
	const now = FieldValue.serverTimestamp();
	data.updated_at = now as any;

	await document(data.id).set(data);
}

export async function update(id: string, data: Partial<IUserStore> & { [key: string]: any }) {
	const now = FieldValue.serverTimestamp();
	data.updated_at = now as any;

	await document(id).update(data);
}

export async function delete_(id: string) {
	await document(id).delete();
}

export function authUidMapDocument(authUid: string) {
	const ref = getFirestore().collection('auth_uid_maps');

	return ref.doc(authUid);
}

export async function userIdByAuthUid(authUid: string) {
	const snapshot = await authUidMapDocument(authUid).get();
	const userId = snapshot.data()?.['user_id'] as string | undefined;

	return userId;
}
