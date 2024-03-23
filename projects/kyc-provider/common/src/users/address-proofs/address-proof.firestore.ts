import { UserFirestore } from '../user.firestore';
import { type IAddressProofStore, AddressProof } from './address-proof';
import { type FirestoreDataConverter, Timestamp } from 'firebase/firestore';

export class AddressProofFirestore {
	static collectionId = 'address_proofs';
	static documentId = 'address_proof_id';
	static virtualPath = `${UserFirestore.virtualPath}/${AddressProofFirestore.collectionId}/{${AddressProofFirestore.documentId}}`;

	static converter: FirestoreDataConverter<AddressProof> = {
		toFirestore: (data: AddressProof) => ({
			...data.dropRedundancy(),
			created_at:
				data.created_at instanceof Date ? Timestamp.fromDate(data.created_at) : data.created_at,
			updated_at:
				data.updated_at instanceof Date ? Timestamp.fromDate(data.updated_at) : data.updated_at
		}),
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options) as IAddressProofStore;
			return new AddressProof(
				snapshot.id,
				data.user_id,
				data.address,
				data.message_hex,
				data.signature_hex,
				data.created_at.toDate(),
				data.updated_at.toDate()
			);
		}
	};

	static collectionPath(userId: string) {
		return `${UserFirestore.documentPath(userId)}/${AddressProofFirestore.collectionId}`;
	}

	static documentPath(userId: string, id: string) {
		return `${UserFirestore.documentPath(userId)}/${AddressProofFirestore.collectionPath(
			userId
		)}/${id}`;
	}
}
