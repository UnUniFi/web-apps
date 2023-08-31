import { IKycRequestStore, KycRequest } from './kyc-request';
import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

export class KycRequestFirestore {
  static collectionId = 'KycRequests';
  static documentId = 'KycRequest_id';
  static virtualPath = `${KycRequestFirestore.collectionId}/{${KycRequestFirestore.documentId}}`;

  static converter: FirestoreDataConverter<KycRequest> = {
    toFirestore: (data: KycRequest) => ({
      ...data.dropRedundancy(),
      created_at:
        data.created_at instanceof Date ? Timestamp.fromDate(data.created_at) : data.created_at,
      updated_at:
        data.updated_at instanceof Date ? Timestamp.fromDate(data.updated_at) : data.updated_at,
    }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options) as IKycRequestStore;
      return new KycRequest(data.name, data.created_at.toDate(), data.updated_at.toDate());
    },
  };

  static collectionPath() {
    return `${KycRequestFirestore.collectionId}`;
  }

  static documentPath(id: string) {
    return `${KycRequestFirestore.collectionPath()}/${id}`;
  }
}
