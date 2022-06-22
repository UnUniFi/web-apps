import { proto } from '@cosmos-client/core';
import { InlineResponse20049 } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData?: InlineResponse20049;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: proto.cosmos.base.v1beta1.ICoin;
};

export type GasSetting = {
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};
