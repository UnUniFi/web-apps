import type { Timestamp } from 'firebase/firestore';

export type IUser = {
	auth_uid: string;
	name: string;
	image_url: string;
	client_id: string;
};

export type IUserStore = IUser & {
	created_at: Timestamp;
	updated_at: Timestamp;
};

export class User implements IUser {
	constructor(
		public id: string,
		public auth_uid: string,
		public name: string,
		public image_url: string,
		public client_id: string,
		public created_at: Date,
		public updated_at: Date
	) {}

	dropRedundancy(): IUser {
		return {
			auth_uid: this.auth_uid,
			name: this.name,
			image_url: this.image_url,
			client_id: this.client_id
		};
	}
}
