import { Injectable } from '@angular/core';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  InlineResponse20012 as InlineResponse,
  InlineResponse2003Balances as InlineResponseBalances,
} from '@cosmos-client/core/esm/openapi';

@Injectable({ providedIn: 'root' })
export class CosmosRestService {
  constructor() {}

  async getNodeInfo(sdk: cosmosclient.CosmosSDK): Promise<InlineResponse> {
    const res = await rest.tendermint.getNodeInfo(sdk);
    return res.data;
  }

  async allBalances(
    sdk: cosmosclient.CosmosSDK,
    cosmosAccAddress: cosmosclient.AccAddress,
  ): Promise<InlineResponseBalances[] | undefined> {
    try {
      const res = await rest.bank.allBalances(sdk, cosmosAccAddress);
      return res.data.balances;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getAccount(
    sdk: cosmosclient.CosmosSDK,
    cosmosAccAddress: cosmosclient.AccAddress,
  ): Promise<InlineResponse | undefined> {
    try {
      const res = await rest.auth.account(sdk, cosmosAccAddress);
      console.log(res.data.account);
      return (res.data &&
        cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account),
        )) as any;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
