import { IUser, User } from './user';
import { UserFirestore } from './user.firestore';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionGroup,
  query,
  QueryConstraint,
  doc,
  getDoc,
  docData,
  getDocs,
  collectionData,
  setDoc,
  serverTimestamp,
  addDoc,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly firestore: Firestore) {}

  collection() {
    const ref = collection(this.firestore, UserFirestore.collectionPath());

    return ref.withConverter(UserFirestore.converter);
  }

  collectionQuery(queryConstraints: QueryConstraint[]) {
    const ref = collection(this.firestore, UserFirestore.collectionPath());

    return query(ref, ...queryConstraints).withConverter(UserFirestore.converter);
  }

  collectionGroup() {
    const ref = collectionGroup(this.firestore, UserFirestore.collectionId);

    return ref.withConverter(UserFirestore.converter);
  }

  collectionGroupQuery(queryConstraints: QueryConstraint[]) {
    const ref = collectionGroup(this.firestore, UserFirestore.collectionId);

    return query(ref, ...queryConstraints).withConverter(UserFirestore.converter);
  }

  document(id: string) {
    const ref = collection(this.firestore, UserFirestore.collectionPath());

    return doc(this.firestore, ref.path, id).withConverter(UserFirestore.converter);
  }

  get(id: string) {
    return getDoc(this.document(id)).then((snapshot) => snapshot.data() as User);
  }

  get$(id: string) {
    return docData(this.document(id)).pipe(map((data) => data as User));
  }

  list() {
    return getDocs(this.collection()).then((snapshots) =>
      snapshots.docs.map((doc) => doc.data() as User),
    );
  }

  list$() {
    return collectionData(this.collection()).pipe(map((data) => data as User[]));
  }

  listGroup() {
    return getDocs(this.collectionGroup()).then((snapshots) =>
      snapshots.docs.map((doc) => doc.data() as User),
    );
  }

  listGroup$() {
    return collectionData(this.collectionGroup()).pipe(map((data) => data as User[]));
  }

  async create(data: IUser) {
    const now = serverTimestamp();

    const user = new User('', data.auth_uid, data.name, data.image_url, now as any, now as any);

    const doc = await addDoc(this.collection(), user);

    return doc.id;
  }

  authUidMapDocument(authUid: string) {
    const ref = collection(this.firestore, 'auth_uid_maps');

    return doc(this.firestore, ref.path, authUid);
  }

  async userIdByAuthUid(authUid: string) {
    const snapshot = await getDoc(this.authUidMapDocument(authUid));
    const userId = snapshot.data()?.['user_id'] as string | undefined;

    return userId;
  }

  userIdByAuthUid$(authUid: string) {
    return docData(this.authUidMapDocument(authUid)).pipe(
      map((data) => data?.['user_id'] as string | undefined),
    );
  }

  uniqueNameMapDocument(uniqueName: string) {
    const ref = collection(this.firestore, 'unique_name_maps');

    return doc(this.firestore, ref.path, uniqueName);
  }

  async userIdByUniqueName(uniqueName: string) {
    const snapshot = await getDoc(this.uniqueNameMapDocument(uniqueName));
    const userId = snapshot.data()?.['user_id'] as string | undefined;

    return userId;
  }

  userIdByUniqueName$(uniqueName: string) {
    return docData(this.uniqueNameMapDocument(uniqueName)).pipe(
      map((data) => data?.['user_id'] as string | undefined),
    );
  }

  async uniqueNameExists(uniqueName: string) {
    const snapshot = await getDoc(this.uniqueNameMapDocument(uniqueName));

    return snapshot.exists();
  }
}
