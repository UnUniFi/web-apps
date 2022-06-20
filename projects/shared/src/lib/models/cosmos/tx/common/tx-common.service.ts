import { convertUnknownAccountToBaseAccount } from '../../../../utils/converter';
import { CosmosSDKService } from '../../../cosmos-sdk/cosmos-sdk.service';
import { KeplrService } from '../../../wallets/keplr/keplr.service';
import { MetaMaskService } from '../../../wallets/metamask/metamask.service';
import { UnunifiWalletService } from '../../../wallets/ununifi-wallet/ununifi-wallet.service';
import { CosmosWallet, WalletType } from '../../../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class TxCommonService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly keplrService: KeplrService,
    private readonly metaMaskService: MetaMaskService,
    private readonly ununifiWalletService: UnunifiWalletService,
  ) {}

  canonicalizeAccAddress(address: string) {
    const canonicalized = address.replace(/\s+/g, '');
    return cosmosclient.AccAddress.fromString(canonicalized);
  }

  validateBalanceBeforeSimulation(
    usageAmount: proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    balances: proto.cosmos.base.v1beta1.ICoin[],
  ) {
    const feeDenom = minimumGasPrice.denom;
    const simulationFeeAmount = 1;
    const tempAmountToSend = usageAmount.find((amount) => amount.denom === feeDenom)?.amount;
    const amountToSend = tempAmountToSend ? parseInt(tempAmountToSend) : 0;
    const tempBalance = balances.find((coin) => coin.denom === minimumGasPrice.denom)?.amount;
    const balance = tempBalance ? parseInt(tempBalance) : 0;

    return {
      feeDenom,
      amountToSend,
      balance,
      simulationFeeAmount,
      validity: amountToSend + simulationFeeAmount <= balance,
    };
  }

  async getBaseAccount(
    cosmosPublicKey: cosmosclient.PubKey,
  ): Promise<proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const account = await rest.auth
      .account(sdk, accAddress)
      .then((res) =>
        cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(res.data?.account),
        ),
      )
      .catch((_) => undefined);
    const baseAccount = convertUnknownAccountToBaseAccount(account);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    return baseAccount;
  }

  async getBaseAccountFromAddress(
    address: cosmosclient.AccAddress,
  ): Promise<proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const account = await rest.auth
      .account(sdk, address)
      .then((res) =>
        cosmosclient.codec.protoJSONToInstance(
          cosmosclient.codec.castProtoJSONOfProtoAny(res.data?.account),
        ),
      )
      .catch((_) => undefined);
    const baseAccount = convertUnknownAccountToBaseAccount(account);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    return baseAccount;
  }

  async buildTxBuilder(
    messages: any[],
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    gas: proto.cosmos.base.v1beta1.ICoin | null | undefined,
    fee: proto.cosmos.base.v1beta1.ICoin | null | undefined,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const packedAnyMessages: proto.google.protobuf.IAny[] = messages.map((message) =>
      cosmosclient.codec.instanceToProtoAny(message),
    );
    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: packedAnyMessages,
    });

    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.instanceToProtoAny(cosmosPublicKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: fee?.amount && fee.amount !== '0' ? [fee] : [],
        gas_limit: Long.fromString(gas?.amount ? gas.amount : '1000000'),
      },
    });
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    return txBuilder;
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    currentCosmosWallet: CosmosWallet,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    if (currentCosmosWallet.type === WalletType.ununifi) {
      return await this.signTxWithPrivateKey(txBuilder, signerBaseAccount, privateKey);
    }
    if (currentCosmosWallet.type === WalletType.keplr) {
      return await this.signTxWithKeplr(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.ledger) {
      return this.signTxWithLedger(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.keyStation) {
      return this.signTxWithKeyStation(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.metaMask) {
      // Todo: Currently, disable MetaMask related features.
      throw Error('Unsupported wallet type!');
      // return this.signTxWithMetaMask(txBuilder, signerBaseAccount);
    }
    throw Error('Unsupported wallet type!');
  }

  async signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    if (privateKey) {
      return await this.ununifiWalletService.signTxWithPrivateKey(
        txBuilder,
        signerBaseAccount,
        privateKey,
      );
    } else {
      return await this.ununifiWalletService.signTx(txBuilder, signerBaseAccount);
    }
  }

  async signTxWithKeplr(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.keplrService.signTx(txBuilder, signerBaseAccount);
    return signedTxBuilder;
  }

  // Todo: This is dummy function and need to implement later.
  signTxWithLedger(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): cosmosclient.TxBuilder {
    throw Error('Currently signing with Ledger is not supported!');
  }

  // Todo: This is dummy function and need to implement later.
  signTxWithKeyStation(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): cosmosclient.TxBuilder {
    throw Error('Currently signing with KeyStation is not supported!');
  }

  async signTxWithMetaMask(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.metaMaskService.signTx(txBuilder, signerBaseAccount);
    return signedTxBuilder;
  }

  async simulateTx(
    txBuilder: cosmosclient.TxBuilder,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    if (minimumGasPrice.amount == '0' || !gasRatio) {
      return {
        minimumGasPrice,
        estimatedGasUsedWithMargin: {
          denom: minimumGasPrice.denom,
          amount: '1000000',
        },
        estimatedFeeWithMargin: {
          denom: minimumGasPrice.denom,
          amount: '0',
        },
      };
    }

    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    // restore json from txBuilder
    const txForSimulation = txBuilder.toProtoJSON() as any;
    console.log(txForSimulation);

    // set dummy signature for simulate
    const uint8Array = new Uint8Array(64);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    if (txForSimulation.signatures.length > 0) {
      txForSimulation.signatures = (txForSimulation.signatures as unknown[]).map(
        (_) => base64String,
      );
    } else {
      txForSimulation.signatures = [base64String];
    }

    // simulate
    const simulatedResult = await rest.tx.simulate(sdk, {
      tx: txForSimulation,
    });
    console.log('simulatedResult', simulatedResult);

    // estimate fee
    const simulatedGasUsed = simulatedResult.data.gas_info?.gas_used;
    // This margin prevents insufficient fee due to data size difference between simulated tx and actual tx.
    const simulatedGasUsedWithMarginNumber = simulatedGasUsed
      ? parseInt(simulatedGasUsed) * (gasRatio ?? 1.1)
      : 1000000;
    const simulatedGasUsedWithMargin = simulatedGasUsedWithMarginNumber.toFixed(0);
    // minimumGasPrice depends on Node's config(`~/.ununifi/config/app.toml` minimum-gas-prices).
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

  async announceTx(txBuilder: cosmosclient.TxBuilder): Promise<InlineResponse20075> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    console.log(txBuilder);

    // broadcast tx
    const result = await rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.tx.BroadcastTxMode.Block,
    });

    // check broadcast tx error
    if (result.data.tx_response?.code !== 0) {
      throw Error(result.data.tx_response?.raw_log);
    }

    return result.data;
  }
}
