import cosmosclient from '@cosmos-client/core';
import { Simulate200Response } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData: Simulate200Response;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
};

export type txTitle = {
  txType: string;
  fromAddress: string;
  toAddress: string;
  amount?: string;

  //for edit/create validator
  minimumSelfDelegation?: string;
  editedCommissionRate?: string;
  description?: cosmosclient.proto.cosmos.staking.v1beta1.IDescription | null;
  commission?: cosmosclient.proto.cosmos.staking.v1beta1.ICommissionRates | null;

  //for redelegate
  validatorDestinationAddress?: string;
  validatorSourceAddress?: string;

  amounts?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[];

  //for proposal
  content?: cosmosclient.proto.cosmos.gov.v1beta1.TextProposal;
  voteOption?: cosmosclient.proto.cosmos.gov.v1beta1.VoteOption;
  voteOptions?: cosmosclient.proto.cosmos.gov.v1beta1.IWeightedVoteOption[];

  //for create vesting account
  vestingDelayed?: boolean;
  vestingEndTime?: string;
};

export type txSignature = {
  publicKey: string;
  accAddress: string;
  type: string;
};
