export type GentxData = {
  privateKey: Uint8Array;
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
  rate: string;
  max_rate: string;
  max_change_rate: string;
  min_self_delegation: string;
  delegator_address: string;
  validator_address: string;
  denom: string;
  amount: string;
  ip: string;
  node_id: string;
  pubkey: string;
};

export type GentxResponse = {
  status: boolean;
  message: string;
};
