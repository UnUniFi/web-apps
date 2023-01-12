import { CosmosSDKService } from '../cosmos-sdk.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Injectable({
  providedIn: 'root',
})
export class TxCommonService {
  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  async simulateTx(
    txBuilder: cosmosclient.TxBuilder,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<SimulatedTxResultResponse> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);

    // cosmosclient.rest ore json from txBuilder
    const txForSimulation = JSON.parse(txBuilder.protoJSONStringify());

    // fix JSONstringify issue
    delete txForSimulation.auth_info.signer_infos[0].mode_info.multi;

    // simulate
    const simulatedResult = await cosmosclient.rest.tx.simulate(sdk, {
      tx: txForSimulation,
      tx_bytes: txBuilder.txBytes(),
    });
    console.log('simulatedResult', simulatedResult);

    // estimate fee
    const simulatedGasUsed = simulatedResult.data.gas_info?.gas_used;
    // This margin prevents insufficient fee due to data size difference between simulated tx and actual tx.
    const simulatedGasUsedWithMarginNumber = simulatedGasUsed
      ? parseInt(simulatedGasUsed) * 1.1
      : 1000000;
    const simulatedGasUsedWithMargin = simulatedGasUsedWithMarginNumber.toFixed(0);
    // minimumGasPrice depends on Node's config(`~/.jpyx/config/app.toml` minimum-gas-prices).
    const simulatedFeeWithMarginNumber =
      parseInt(simulatedGasUsedWithMargin) *
      parseFloat(minimumGasPrice.amount ? minimumGasPrice.amount : '0');
    const simulatedFeeWithMargin = Math.ceil(simulatedFeeWithMarginNumber).toFixed(0);
    console.log({
      simulatedGasUsed,
      simulatedGasUsedWithMargin,
      simulatedFeeWithMarginNumber,
      simulatedFeeWithMargin,
    });

    return {
      simulatedResultData: simulatedResult.data,
      minimumGasPrice,
      estimatedGasUsedWithMargin: {
        denom: minimumGasPrice.denom,
        amount: simulatedGasUsedWithMargin,
      },
      estimatedFeeWithMargin: {
        denom: minimumGasPrice.denom,
        amount: simulatedFeeWithMargin,
      },
    };
  }

  async announceTx(txBuilder: cosmosclient.TxBuilder): Promise<BroadcastTx200Response> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);

    // broadcast tx
    const result = await cosmosclient.rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: cosmosclient.rest.tx.BroadcastTxMode.Block,
    });

    window.alert(`Copy the following txHash for AirDrop!\n${result.data.tx_response?.txhash}`);

    // check broadcast tx error
    if (result.data.tx_response?.code !== 0) {
      throw Error(result.data.tx_response?.raw_log);
    }

    return result.data;
  }
}
