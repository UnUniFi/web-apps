import { proto } from '@cosmos-client/core';
import { InlineResponse20074 } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData: InlineResponse20074;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: proto.cosmos.base.v1beta1.ICoin;
};

export type txTitle = {
  txType: string;
  fromAddress: string;
  toAddress: string;
  amount: string;

  proposal?: string;
  minimumSelfDelegation?: string;
  editedCommissionRate?: string;
  description?: proto.cosmos.staking.v1beta1.IDescription | null;
  commission?: proto.cosmos.staking.v1beta1.ICommissionRates | null;

  validatorDestinationAddress?: string
  validatorSourceAddress?: string
}

export type txSignature = {
  publicKey: string;
  accAddress: string;
  type: string;
}
