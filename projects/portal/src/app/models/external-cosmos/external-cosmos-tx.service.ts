import {
  convertHexStringToUint8Array,
  convertUnknownAccountToBaseAccount,
} from '../../utils/converter';
import { BankService } from '../cosmos/bank.service';
import { KeplrService } from '../wallets/keplr/keplr.service';
import { LeapService } from '../wallets/leap/leap.service';
import { CosmosWallet, WalletType } from '../wallets/wallet.model';
import { ExternalCosmosSdkService } from './external-cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import cosmwasmclient from '@cosmos-client/cosmwasm';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class ExternalCosmosTxService {
  constructor(
    private readonly bankService: BankService,
    private readonly keplrService: KeplrService,
    private readonly leapService: LeapService,
    private readonly cosmwasmSdkService: ExternalCosmosSdkService,
  ) {}

  buildMsgExecuteContract(
    sender: string,
    contractAddress: string,
    msg: any,
    amounts: { denom: string; readableAmount: number }[],
  ) {
    const coins = amounts.map(
      (amount) =>
        this.bankService.convertDenomReadableAmountMapToCoins({
          [amount.denom]: amount.readableAmount,
        })[0],
    );
    const msgString = JSON.stringify(msg);
    const msgUint8Array = convertHexStringToUint8Array(msgString);
    const ExecuteMsg = new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgExecuteContract({
      sender,
      contract: contractAddress,
      msg: msgUint8Array,
      funds: coins,
    });
    return ExecuteMsg;
  }

  async buildTxBuilder(
    id: string,
    messages: any[],
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    gas?: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee?: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmwasmSdkService.sdk(id).then((sdk) => sdk.rest);
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

  async getBaseAccount(
    id: string,
    cosmosPublicKey: cosmosclient.PubKey,
  ): Promise<cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmwasmSdkService.sdk(id).then((sdk) => sdk.rest);
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const account = await cosmosclient.rest.auth
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
    id: string,
    address: cosmosclient.AccAddress,
  ): Promise<cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | null | undefined> {
    const sdk = await this.cosmwasmSdkService.sdk(id).then((sdk) => sdk.rest);
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
    id: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    walletType: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    if (walletType === WalletType.keplr) {
      return await this.signTxWithKeplr(id, txBuilder, signerBaseAccount);
    }
    if (walletType === WalletType.leap) {
      return await this.signTxWithLeap(id, txBuilder, signerBaseAccount);
    }
    throw Error('Unsupported wallet type!');
  }

  async signTxWithKeplr(
    id: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.keplrService.signTxExternal(
      id,
      txBuilder,
      signerBaseAccount,
    );
    return signedTxBuilder;
  }

  async signTxWithLeap(
    id: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signedTxBuilder = await this.leapService.signTxExternal(id, txBuilder, signerBaseAccount);
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
