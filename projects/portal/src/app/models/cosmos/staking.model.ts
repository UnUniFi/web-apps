export type CreateValidatorData = {
  moniker: string;
  identity?: string;
  website?: string;
  security_contact?: string;
  details?: string;
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

export type EditValidatorData = {
  rate: string;
  details?: string;
  identity?: string;
  min_self_delegation: string;
  moniker: string;
  security_contact?: string;
  website?: string;
  delegator_address: string;
  validator_address: string;
};
