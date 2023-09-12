import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { KeplrService } from '../wallets/keplr/keplr.service';
import { LeapService } from '../wallets/leap/leap.service';
import { WalletType } from '../wallets/wallet.model';
import { ExternalCosmosSdkService } from './external-cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class ExternalCosmosTxService {
  constructor(
    private readonly keplrService: KeplrService,
    private readonly leapService: LeapService,
    private readonly cosmwasmSdkService: ExternalCosmosSdkService,
  ) {}

  async buildTxBuilder(
    chainId: string,
    messages: any[],
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    gas?: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee?: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmwasmSdkService.sdk(chainId).then((sdk) => sdk.rest);
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

  async getBaseAccountFromAddress(
    chainId: string,
    address: string,
  ): Promise<cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmwasmSdkService.sdk(chainId).then((sdk) => sdk.rest);
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

  async signTx(
    chainId: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    walletType: WalletType,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    if (walletType === WalletType.keplr) {
      return await this.signTxWithKeplr(chainId, txBuilder, signerBaseAccount);
    }
    if (walletType === WalletType.leap) {
      return await this.signTxWithLeap(chainId, txBuilder, signerBaseAccount);
    }
    throw Error('Unsupported wallet type!');
  }

  async signTxWithKeplr(
    chainId: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.keplrService.signTxExternal(
      chainId,
      txBuilder,
      signerBaseAccount,
    );
    return signedTxBuilder;
  }

  async signTxWithLeap(
    chainId: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.leapService.signTxExternal(
      chainId,
      txBuilder,
      signerBaseAccount,
    );
    return signedTxBuilder;
  }

  async announceTx(id: string, txBuilder: cosmosclient.TxBuilder): Promise<BroadcastTx200Response> {
    const sdk = await this.cosmwasmSdkService.sdk(id).then((sdk) => sdk.rest);
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
}
