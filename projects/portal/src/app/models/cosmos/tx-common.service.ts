import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { createCosmosPrivateKeyFromString } from '../../utils/key';
import { validatePrivateStoredWallet } from '../../utils/validater';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { KeplrApplicationService } from '../keplr/keplr.application.service';
import { KeyType } from '../keys/key.model';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { CosmosWallet, StoredWallet, WalletType } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class TxCommonService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletAppService: WalletApplicationService,
    private readonly keplrAppService: KeplrApplicationService,
  ) {}

  async getBaseAccount(
    cosmosPublicKey: cosmosclient.PubKey,
  ): Promise<proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const account = await rest.auth
      .account(sdk, accAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
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
      cosmosclient.codec.packAny(message),
    );
    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: packedAnyMessages,
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(cosmosPublicKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: fee ? [fee] : null,
        gas_limit: cosmosclient.Long.fromString(gas?.amount ? gas.amount : '200000'),
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
      return this.keplrAppService.signDirect(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.ledger) {
      return this.signTxWithLedger(txBuilder, signerBaseAccount);
    }
    if (currentCosmosWallet.type === WalletType.keyStation) {
      return this.signTxWithKeyStation(txBuilder, signerBaseAccount);
    }
    throw Error('Unsupported wallet type!');
  }

  async signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    let cosmosPrivateKey: cosmosclient.PrivKey | undefined;
    console.log(privateKey);
    if (privateKey) {
      cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.secp256k1, privateKey);
    } else {
      console.log('hoge');
      const privateWallet: StoredWallet & { privateKey: string } =
        await this.walletAppService.openUnunifiKeyFormDialog();
      console.log(privateWallet);
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

  // Todo: This is dummy function and need to implement later.
  signTxWithKeplr(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): cosmosclient.TxBuilder {
    throw Error('Currently signing with Keplr is not supported!');
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

  async simulateTx(
    txBuilder: cosmosclient.TxBuilder,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    // restore json from txBuilder
    const txForSimulation = JSON.parse(txBuilder.cosmosJSONStringify());
    // fix JSONstringify issue
    delete txForSimulation.auth_info.signer_infos[0].mode_info.multi;

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
      : 200000;
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
