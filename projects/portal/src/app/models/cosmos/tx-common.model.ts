import { proto } from '@cosmos-client/core';
import { InlineResponse20049 } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData?: InlineResponse20049;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: proto.cosmos.base.v1beta1.ICoin;
};

export type MetaMaskTx = {
  domain: {
    chainId: number; // Note: This should be MetaMask account's network's chainID. Not chainID of Cosmos SDK blockchain.
    name: string;
    version: string;
  };
  message: {
    // Note: this message is Cosmos SDK related tx data.
    body: string;
    auth_info: string;
    chain_id: string; // Note: This should be chainID of Cosmos SDK blockchain. Not MetaMask account's network's chainID.
    account_number: string; // Note: Because I concern Long cause JSON.stringify trouble, I recommend to use string as account_number type.
  };
  primaryType: 'Message';
  types: {
    EIP712Domain: [
      {
        name: 'name';
        type: 'string';
      },
      {
        name: 'version';
        type: 'string';
      },
      {
        name: 'chainId';
        type: 'uint256';
      },
    ];
    Message: [
      {
        name: 'body';
        type: 'string';
      },
      {
        name: 'auth_info';
        type: 'string';
      },
      {
        name: 'chain_id';
        type: 'string';
      },
      {
        name: 'account_number';
        type: 'string';
      },
    ];
  };
};
