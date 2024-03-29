import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { createCosmosPrivateKeyFromUint8Array } from '../../utils/key';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { KeyType } from '../keys/key.model';
import { CosmosWallet } from '../wallets/wallet.model';
import { CreateValidatorData, EditValidatorData } from './staking.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
  ) {}

  // Create Validator
  async createValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null,
    privateKey: Uint8Array,
  ): Promise<BroadcastTx200Response> {
    const txBuilder = await this.buildCreateValidator(
      keyType,
      createValidatorData,
      gas,
      fee,
      privateKey,
    );

    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToCreateValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildCreateValidator(
      keyType,
      createValidatorData,
      dummyGas,
      dummyFee,
      privateKey,
    );

    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  private makeCommissionValues(
    commission: cosmosclient.proto.cosmos.staking.v1beta1.ICommissionRates,
  ): cosmosclient.proto.cosmos.staking.v1beta1.ICommissionRates {
    const pairs: [string, string][] = Object.entries(commission).map((pair: [string, string]) => {
      const [key, value] = pair;
      const longValue = Long.fromString(value);
      const isValidValue = longValue.greaterThanOrEqual(0) && longValue.lessThanOrEqual(1);
      if (!isValidValue) {
        throw new Error(`Error: commission ${key} expected to be from 0 to 1, but got ${value}`);
      }

      const multipliedValue = longValue.mul(1e18);
      return [key, multipliedValue.toString()];
    });
    return Object.fromEntries(pairs);
  }

  async buildCreateValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null,
    privateKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = createCosmosPrivateKeyFromUint8Array(keyType, privateKey);
    if (!privKey) {
      throw Error('Invalid privateKey!');
    }
    const pubKey = privKey.pubKey();
    const accAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(pubKey);

    // get account info
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

    if (createValidatorData.delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (createValidatorData.validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    const pubKeyJson = JSON.parse(createValidatorData.pubkey);
    const cosmosValConsPublicKey = new cosmosclient.proto.cosmos.crypto.ed25519.PubKey({
      key: pubKeyJson.key,
    });
    const packedAnyCosmosValConsPublicKey =
      cosmosclient.codec.instanceToProtoAny(cosmosValConsPublicKey);

    const commission = this.makeCommissionValues({
      rate: createValidatorData.rate,
      max_rate: createValidatorData.max_rate,
      max_change_rate: createValidatorData.max_change_rate,
    });

    const createValidatorTxData = {
      description: {
        moniker: createValidatorData.moniker,
        identity: createValidatorData.identity,
        website: createValidatorData.website,
        security_contact: createValidatorData.security_contact,
        details: createValidatorData.details,
      },
      commission,
      min_self_delegation: createValidatorData.min_self_delegation,
      delegator_address: createValidatorData.delegator_address,
      validator_address: createValidatorData.validator_address,
      pubkey: packedAnyCosmosValConsPublicKey,
      value: {
        denom: createValidatorData.denom,
        amount: createValidatorData.amount,
      },
    };
    const msgCreateValidator = new cosmosclient.proto.cosmos.staking.v1beta1.MsgCreateValidator(
      createValidatorTxData,
    );

    const txBody = new cosmosclient.proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.instanceToProtoAny(msgCreateValidator)],
      memo: `${createValidatorData.node_id}@${createValidatorData.ip}:26656`,
    });

    const authInfo = new cosmosclient.proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.instanceToProtoAny(pubKey),
          mode_info: {
            single: {
              mode: cosmosclient.proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [],
        gas_limit: Long.fromString(gas.amount ? gas.amount : '1000000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  // Edit Validator
  async editValidator(
    editValidatorData: EditValidatorData,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null,
    privateKey: Uint8Array,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildEditValidator(editValidatorData, gas, fee, cosmosPublicKey);

    const signerBaseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!signerBaseAccount) {
      throw Error('Unsupported Account!');
    }

    //Todo: privateKey in tx.common.service should be Uint8Array
    const privatekyString = Buffer.from(privateKey).toString('hex');

    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      signerBaseAccount,
      currentCosmosWallet,
      privatekyString,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    return await this.txCommonService.announceTx(signedTxBuilder);
  }

  async simulateToEditValidator(
    editValidatorData: EditValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildEditValidator(
      editValidatorData,
      dummyGas,
      dummyFee,
      cosmosPublicKey,
    );

    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildEditValidator(
    editValidatorData: EditValidatorData,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null,
    cosmosPublicKey: cosmosclient.PubKey,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(cosmosPublicKey);

    // get account info
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

    if (editValidatorData.delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (editValidatorData.validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    // build tx ... Note: commission percent rate values are converted here.
    const editValidatorTxData = {
      description: {
        moniker: editValidatorData.moniker,
        identity: editValidatorData.identity,
        website: editValidatorData.website,
        security_contact: editValidatorData.security_contact,
        details: editValidatorData.details,
      },
      validator_address: editValidatorData.validator_address,
      commission_rate: `${editValidatorData.rate}${'0000000000000000'}`,
      min_self_delegation: editValidatorData.min_self_delegation,
    };
    const msgEditValidator = new cosmosclient.proto.cosmos.staking.v1beta1.MsgEditValidator(
      editValidatorTxData,
    );

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgEditValidator],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  // Create Delegate
  async createDelegate(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildCreateDelegateTxBuilder(
      validatorAddress,
      amount,
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

  async simulateToCreateDelegate(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildCreateDelegateTxBuilder(
      validatorAddress,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildCreateDelegateTxBuilder(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgDelegate = this.buildMsgDelegate(fromAddress.toString(), validatorAddress, amount);

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgDelegate],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildMsgDelegate(
    delegatorAddress: string,
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate {
    const msgDelegate = new cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount,
    });
    return msgDelegate;
  }

  // Change Delegate
  async redelegate(
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;

    const txBuilder = await this.buildRedelegateTxBuilder(
      validatorAddressBefore,
      validatorAddressAfter,
      amount,
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

  async simulateToRedelegate(
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildRedelegateTxBuilder(
      validatorAddressBefore,
      validatorAddressAfter,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildRedelegateTxBuilder(
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgRedelegate = this.buildMsgRedelegate(
      fromAddress.toString(),
      validatorAddressBefore,
      validatorAddressAfter,
      amount,
    );

    // build tx

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgRedelegate],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );

    return txBuilder;
  }

  buildMsgRedelegate(
    delegatorAddress: string,
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): cosmosclient.proto.cosmos.staking.v1beta1.MsgBeginRedelegate {
    const msgRedelegate = new cosmosclient.proto.cosmos.staking.v1beta1.MsgBeginRedelegate({
      delegator_address: delegatorAddress,
      validator_src_address: validatorAddressBefore,
      validator_dst_address: validatorAddressAfter,
      amount,
    });
    return msgRedelegate;
  }

  //  Delete Delegate
  async undelegate(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildUndelegateTxBuilder(
      validatorAddress,
      amount,
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

  async simulateToUndelegate(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildUndelegateTxBuilder(
      validatorAddress,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildUndelegateTxBuilder(
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);

    const msgUndelegate = this.buildMsgUndelegate(fromAddress.toString(), validatorAddress, amount);

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgUndelegate],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }
  buildMsgUndelegate(
    delegatorAddress: string,
    validatorAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): cosmosclient.proto.cosmos.staking.v1beta1.MsgUndelegate {
    const msgUndelegate = new cosmosclient.proto.cosmos.staking.v1beta1.MsgUndelegate({
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount,
    });
    return msgUndelegate;
  }
}
