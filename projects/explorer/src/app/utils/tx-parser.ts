import { txTitle } from './../models/cosmos/tx-common.model';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi/api';
import { cosmosclient, proto } from '@cosmos-client/core';


export const txParseMsgDelegate = (tx: CosmosTxV1beta1GetTxsEventResponse): txTitle | undefined => {




  console.log(tx)
  const A = tx.txs?.[0].body?.messages?.[0].type_url
  const B = tx.txs?.[0].body?.messages?.[0].value
  const C = tx.txs?.[0].body?.messages?.[0]

  const C1 = (tx.txs?.[0].body?.messages?.[0] as any)['@type'] // (message as any)['@type'] as string;
  const C2 = (tx.txs?.[0].body?.messages?.[0] as any)['delegator_address']// (message as any)['@type'] as string;
  const C3 = (tx.txs?.[0].body?.messages?.[0] as any)['amount']// (message as any)['@type'] as string;
  const C4 = (tx.txs?.[0].body?.messages?.[0] as any)['validator_address']// (message as any)['@type'] as string;

  //const D = cosmosclient.codec.unpackAny(C1);

  console.log({ A, B, C, C1, C2, C3, C4 })
  return undefined
}

