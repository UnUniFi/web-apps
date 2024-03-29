import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { createCosmosPrivateKeyFromString } from '../../utils/key';
import { validatePrivateStoredWallet } from '../../utils/validation';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { KeyType } from '../keys/key.model';
import { KeplrService } from '../wallets/keplr/keplr.service';
import { LeapService } from '../wallets/leap/leap.service';
import { MetaMaskService } from '../wallets/metamask/metamask.service';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { CosmosWallet, StoredWallet, WalletType } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import {
  BroadcastTx200Response,
  CosmosTxV1beta1GetTxResponse,
  GetLatestBlock200Response,
} from '@cosmos-client/core/esm/openapi';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class TxCommonService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletAppService: WalletApplicationService,
    private readonly keplrService: KeplrService,
    private readonly leapService: LeapService,
  ) {}

  canonicalizeAccAddress(address: string) {
    const canonicalized = address.replace(/\s+/g, '');
    return cosmosclient.AccAddress.fromString(canonicalized);
  }

  validateBalanceBeforeSimulation(
    usageAmount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    balances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
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
  ): Promise<cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const account = await cosmosclient.rest.auth
      .account(sdk, accAddress.toString())
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
    address: string,
  ): Promise<cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const account = await cosmosclient.rest.auth
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

  async buildTxBuilderWithDummyGasAndFee(
    messages: any[],
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ) {
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };

    return await this.buildTxBuilder(messages, cosmosPublicKey, baseAccount, dummyGas, dummyFee);
  }

  async buildTxBuilder(
    // TODO: instanceToProtoAny should be called before this function for type safety
    // messages: cosmosclient.proto.google.protobuf.IAny[],
    messages: any[],
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null | undefined,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null | undefined,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const packedAnyMessages: cosmosclient.proto.google.protobuf.IAny[] = messages.map((message) =>
      cosmosclient.codec.instanceToProtoAny(message),
    );
    const txBody = new cosmosclient.proto.cosmos.tx.v1beta1.TxBody({
      messages: packedAnyMessages,
    });

    const authInfo = new cosmosclient.proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.instanceToProtoAny(cosmosPublicKey),
          mode_info: {
            single: {
              mode: cosmosclient.proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
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
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    currentCosmosWallet: CosmosWallet,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    if (currentCosmosWallet.type === WalletType.ununifi) {
      return await this.signTxWithPrivateKey(txBuilder, signerBaseAccount, privateKey);
    }
    if (currentCosmosWallet.type === WalletType.keplr) {
      return await this.signTxWithKeplr(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.leap) {
      return await this.signTxWithLeap(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.metamask) {
      // Todo: Currently disabled MetaMask related features.
      throw Error('Unsupported wallet type!');
      // return this.signTxWithMetaMask(txBuilder, signerBaseAccount);
    }
    throw Error('Unsupported wallet type!');
  }

  async signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    let cosmosPrivateKey: cosmosclient.PrivKey | undefined;
    if (privateKey) {
      cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.secp256k1, privateKey);
    } else {
      const privateWallet: (StoredWallet & { privateKey: string }) | undefined =
        await this.walletAppService.openUnunifiKeyFormDialog();
      if (!privateWallet || !privateWallet.privateKey) {
        this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
        return;
      }
      if (!validatePrivateStoredWallet(privateWallet)) {
        this.snackBar.open('Invalid Wallet info!', 'Close');
        return;
      }
      cosmosPrivateKey = createCosmosPrivateKeyFromString(
        KeyType.secp256k1,
        privateWallet.privateKey,
      );
    }
    if (!cosmosPrivateKey) {
      throw Error('Invalid Private Key!');
    }
    const signDocBytes = txBuilder.signDocBytes(signerBaseAccount.account_number);
    const signature = cosmosPrivateKey.sign(signDocBytes);
    txBuilder.addSignature(signature);
    return txBuilder;
  }

  async signTxWithKeplr(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.keplrService.signTx(txBuilder, signerBaseAccount);
    return signedTxBuilder;
  }

  async signTxWithLeap(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.leapService.signTx(txBuilder, signerBaseAccount);
    return signedTxBuilder;
  }

  async simulateTx(
    txBuilder: cosmosclient.TxBuilder,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
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
    // cosmosclient.rest ore json from txBuilder
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
    const simulatedResult = await cosmosclient.rest.tx.simulate(sdk, {
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

  async announceTx(txBuilder: cosmosclient.TxBuilder): Promise<BroadcastTx200Response> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    console.log(txBuilder);

    // broadcast tx
    const result = await cosmosclient.rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: cosmosclient.rest.tx.BroadcastTxMode.Sync,
    });

    // check broadcast tx error
    if (result.data.tx_response?.code !== 0) {
      throw Error(result.data.tx_response?.raw_log);
    }

    return result.data;
  }

  async getTx(hash: string): Promise<CosmosTxV1beta1GetTxResponse> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await cosmosclient.rest.tx.getTx(sdk, hash);
    return res.data;
  }

  async getLatestBlock(): Promise<GetLatestBlock200Response> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await cosmosclient.rest.tendermint.getLatestBlock(sdk);
    return res.data;
  }

  numberToDecString(num: number) {
    return (num * 10 ** 18).toString();
  }
}
