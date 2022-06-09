import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { createCosmosPrivateKeyFromUint8Array } from '../../utils/key';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { KeyType } from '../keys/key.model';
import { CosmosWallet } from '../wallets/wallet.model';
import { CreateValidatorData } from './staking.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
  ) { }

  // Create Validator
  async createValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin | null,
    privateKey: Uint8Array,
  ): Promise<InlineResponse20075> {
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
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
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
    commission: proto.cosmos.staking.v1beta1.ICommissionRates,
  ): proto.cosmos.staking.v1beta1.ICommissionRates {
    const pairs: [string, string][] = Object.entries(commission).map((pair: [string, string]) => {
      const [key, value] = pair;
      const bnValue = new BigNumber(value);
      const isValidValue = bnValue.gte(0) && bnValue.lte(1);
      if (!isValidValue) {
        throw new Error(`Error: commission ${key} expected to be from 0 to 1, but got ${value}`);
      }

      return [key, bnValue.times(1e18).toFixed(0)];
    });
    return Object.fromEntries(pairs);
  }

  async buildCreateValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin | null,
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
    const account = await rest.auth
      .account(sdk, accAddress)
      .then(
        (res) =>
          res.data.account &&
          cosmosclient.codec.protoJSONToInstance(
            cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account),
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
    const cosmosValConsPublicKey = new proto.cosmos.crypto.ed25519.PubKey({ key: pubKeyJson.key });
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
    const msgCreateValidator = new proto.cosmos.staking.v1beta1.MsgCreateValidator(
      createValidatorTxData,
    );

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.instanceToProtoAny(msgCreateValidator)],
      memo: `${createValidatorData.node_id}@${createValidatorData.ip}:26656`,
    });

    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.instanceToProtoAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: baseAccount.sequence,
        },
      ],
      fee: {
        amount: [],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '1000000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  // Create Delegate
  async createDelegate(
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
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
    amount: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
  ): proto.cosmos.staking.v1beta1.MsgDelegate {
    const msgDelegate = new proto.cosmos.staking.v1beta1.MsgDelegate({
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
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
    amount: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
  ): proto.cosmos.staking.v1beta1.MsgBeginRedelegate {
    const msgRedelegate = new proto.cosmos.staking.v1beta1.MsgBeginRedelegate({
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
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
    amount: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
  ): proto.cosmos.staking.v1beta1.MsgUndelegate {
    const msgUndelegate = new proto.cosmos.staking.v1beta1.MsgUndelegate({
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount,
    });
    return msgUndelegate;
  }
}
