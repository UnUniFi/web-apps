import cosmosclient from '@cosmos-client/core';
import { Simulate200Response } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData?: Simulate200Response;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
};

export type GasSetting = {
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};
