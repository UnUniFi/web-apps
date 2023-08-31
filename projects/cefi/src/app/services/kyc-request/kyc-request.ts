import { Timestamp } from 'firebase/firestore';

export type IKycRequest = {
  name: string;
};

export type IKycRequestStore = IKycRequest & {
  created_at: Timestamp;
  updated_at: Timestamp;
};

export class KycRequest implements IKycRequest {
  constructor(public name: string, public created_at: Date, public updated_at: Date) {}

  dropRedundancy(): IKycRequest {
    return {
      name: this.name,
    };
  }
}
