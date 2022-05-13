import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { ICdpInfrastructure } from './cdp.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/portal/src/app/models/cosmos-sdk.service';
import { ununifi } from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class CdpInfrastructureService implements ICdpInfrastructure {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly keyService: KeyService,
    private readonly txCommonService: TxCommonService,
  ) {}

  async createCDP(
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    principal: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildCreateCDPTxBuilder(
      collateralType,
      collateral,
      principal,
      cosmosPublicKey,
      gas,
      fee,
    );
    const signerBaseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!signerBaseAccount) {
      throw Error('Unsupported Account!');
    }
    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      signerBaseAccount,
      currentCosmosWallet,
      privateKey,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    const txResult = await this.txCommonService.announceTx(signedTxBuilder);
    return txResult;
  }

  async simulateToCreateCDP(
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    principal: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildCreateCDPTxBuilder(
      collateralType,
      collateral,
      principal,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildCreateCDPTxBuilder(
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    principal: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    // get account info
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const sender = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);

    // build tx
    const msgCreateCdp = new ununifi.cdp.MsgCreateCdp({
      sender: sender.toString(),
      collateral,
      principal,
      collateral_type: collateralType,
    });

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgCreateCdp],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  async drawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildDrawCDPTx(
      key,
      privateKey,
      collateralType,
      principal,
      gas,
      fee,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToDrawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildDrawCDPTx(
      key,
      privateKey,
      collateralType,
      principal,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildDrawCDPTx(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk();
    const privKey = this.keyService.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const sender = cosmosclient.AccAddress.fromPublicKey(privKey.pubKey());

    // get account info
    const account = await rest.auth
      .account(sdk.rest, sender)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    const baseAccount = convertUnknownAccountToBaseAccount(account);

    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }

    const msgDrawDebt = new ununifi.cdp.MsgDrawDebt({
      sender: sender.toString(),
      collateral_type: collateralType,
      principal,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDrawDebt)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '300000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk.rest, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  async repayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildRepayCDPTx(
      key,
      privateKey,
      collateralType,
      repayment,
      gas,
      fee,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToRepayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildRepayCDPTx(
      key,
      privateKey,
      collateralType,
      repayment,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildRepayCDPTx(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk();
    const privKey = this.keyService.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const sender = cosmosclient.AccAddress.fromPublicKey(privKey.pubKey());

    // get account info
    const account = await rest.auth
      .account(sdk.rest, sender)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    const baseAccount = convertUnknownAccountToBaseAccount(account);

    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }

    const msgRepayDebt = new ununifi.cdp.MsgRepayDebt({
      sender: sender.toString(),
      collateral_type: collateralType,
      payment: repayment,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgRepayDebt)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '300000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk.rest, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  async depositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const txBUilder = await this.buildDepositCDPTx(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      gas,
      fee,
    );
    return await this.txCommonService.announceTx(txBUilder);
  }

  async simulateToDepositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBUilder = await this.buildDepositCDPTx(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBUilder, minimumGasPrice, gasRatio);
  }

  async buildDepositCDPTx(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk();
    const privKey = this.keyService.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const sender = cosmosclient.AccAddress.fromPublicKey(privKey.pubKey());

    // get account info
    const account = await rest.auth
      .account(sdk.rest, sender)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    const baseAccount = convertUnknownAccountToBaseAccount(account);

    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }

    // build tx
    const msgDepositCDP = new ununifi.cdp.MsgDeposit({
      depositor: sender.toString(),
      owner: ownerAddr.toString(),
      collateral,
      collateral_type: collateralType,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDepositCDP)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '300000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk.rest, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  async withdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildWithdrawCDPTx(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      gas,
      fee,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToWithdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildWithdrawCDPTx(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildWithdrawCDPTx(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk();
    const privKey = this.keyService.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const sender = cosmosclient.AccAddress.fromPublicKey(privKey.pubKey());

    // get account info
    const account = await rest.auth
      .account(sdk.rest, sender)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    const baseAccount = convertUnknownAccountToBaseAccount(account);

    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }

    // build tx
    const msgWithdraw = new ununifi.cdp.MsgWithdraw({
      depositor: sender.toString(),
      owner: ownerAddr.toString(),
      collateral,
      collateral_type: collateralType,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgWithdraw)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '300000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk.rest, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }
}
