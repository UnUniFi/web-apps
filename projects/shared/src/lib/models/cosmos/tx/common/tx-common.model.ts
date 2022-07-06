import cosmosclient from '@cosmos-client/core';
import { InlineResponse20049 } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData?: InlineResponse20049;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
};

export type GasSetting = {
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};
