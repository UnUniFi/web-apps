import type { Timestamp } from 'firebase/firestore';

export type IAddressProof = {
	user_id: string;
	address: string;
	message_hex: string;
	signature_hex: string;
};

export type IAddressProofStore = IAddressProof & {
	created_at: Timestamp;
	updated_at: Timestamp;
};

export class AddressProof implements IAddressProof {
	constructor(
		public id: string,
		public user_id: string,
		public address: string,
		public message_hex: string,
		public signature_hex: string,
		public created_at: Date,
		public updated_at: Date
	) {}

	dropRedundancy(): IAddressProof {
		return {
			user_id: this.user_id,
			address: this.address,
			message_hex: this.message_hex,
			signature_hex: this.signature_hex
		};
	}
}
