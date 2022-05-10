import { createCosmosPublicKeyFromUint8Array } from '../../../utils/key';
import { CosmosSDKService } from '../../cosmos-sdk.service';
import { KeplrApplicationService } from '../../keplr/keplr.application.service';
import { KeyType } from '../../keys/key.model';
import { CreateValidatorData } from '../staking.model';
import { SimulatedTxResultResponse } from '../tx-common.model';
import { TxCommonService } from '../tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class KeplrStakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
    private readonly keplrAppService: KeplrApplicationService,
  ) {}

  // Create Validator
  async createValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildCreateValidator(
      keyType,
      createValidatorData,
      gas,
      fee,
      publicKey,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToCreateValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
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
      publicKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildCreateValidator(
    keyType: KeyType,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const pubKey = createCosmosPublicKeyFromUint8Array(keyType, publicKey);
    if (!pubKey) {
      throw Error('Invalid publicKey!');
    }
    const accAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, accAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    if (createValidatorData.delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (createValidatorData.validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    const pubKeyJson = JSON.parse(createValidatorData.pubkey);
    const cosmosValConsPublicKey = new proto.cosmos.crypto.ed25519.PubKey({ key: pubKeyJson.key });
    const packedAnyCosmosValConsPublicKey = cosmosclient.codec.packAny(cosmosValConsPublicKey);

    // build tx ... Note: commission percent rate values are converted here.
    const createValidatorTxData = {
      description: {
        moniker: createValidatorData.moniker,
        identity: createValidatorData.identity,
        website: createValidatorData.website,
        security_contact: createValidatorData.security_contact,
        details: createValidatorData.details,
      },
      commission: {
        rate: `${createValidatorData.rate}${'0000000000000000'}`,
        max_rate: `${createValidatorData.max_rate}${'0000000000000000'}`,
        max_change_rate: `${createValidatorData.max_change_rate}${'0000000000000000'}`,
      },
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
      messages: [cosmosclient.codec.packAny(msgCreateValidator)],
      memo: `${createValidatorData.node_id}@${createValidatorData.ip}:26656`,
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
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signedTxBuilder = this.keplrAppService.signDirect(
      txBuilder,
      account.account_number,
      accAddress.toString(),
    );
    return signedTxBuilder;
  }

  // Create Delegate
  async createDelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildCreateDelegate(
      keyType,
      validatorAddress,
      amount,
      gas,
      fee,
      publicKey,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToCreateDelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
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
    const simulatedTxBuilder = await this.buildCreateDelegate(
      keyType,
      validatorAddress,
      amount,
      dummyGas,
      dummyFee,
      publicKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildCreateDelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const pubKey = createCosmosPublicKeyFromUint8Array(keyType, publicKey);
    if (!pubKey) {
      throw Error('Invalid publicKey!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
      .then(
        (res) =>
          res.data.account &&
          (cosmosclient.codec.unpackCosmosAny(
            res.data.account,
          ) as proto.cosmos.auth.v1beta1.BaseAccount),
      )
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    // build tx
    const msgDelegate = new proto.cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: fromAddress.toString(),
      validator_address: validatorAddress,
      amount,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDelegate)],
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
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signedTxBuilder = this.keplrAppService.signDirect(
      txBuilder,
      account.account_number,
      fromAddress.toString(),
    );
    return signedTxBuilder;
  }

  // Change Delegate
  async redelegate(
    keyType: KeyType,
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildRedelegate(
      keyType,
      validatorAddressBefore,
      validatorAddressAfter,
      amount,
      gas,
      fee,
      publicKey,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToRedelegate(
    keyType: KeyType,
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
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
    const simulatedTxBuilder = await this.buildRedelegate(
      keyType,
      validatorAddressBefore,
      validatorAddressAfter,
      amount,
      dummyGas,
      dummyFee,
      publicKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildRedelegate(
    keyType: KeyType,
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const pubKey = createCosmosPublicKeyFromUint8Array(keyType, publicKey);
    if (!pubKey) {
      throw Error('Invalid publicKey!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
      .then(
        (res) =>
          res.data.account &&
          (cosmosclient.codec.unpackCosmosAny(
            res.data.account,
          ) as proto.cosmos.auth.v1beta1.BaseAccount),
      )
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    // build tx
    const msgDelegate = new proto.cosmos.staking.v1beta1.MsgBeginRedelegate({
      delegator_address: fromAddress.toString(),
      validator_src_address: validatorAddressBefore,
      validator_dst_address: validatorAddressAfter,
      amount,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDelegate)],
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
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signedTxBuilder = this.keplrAppService.signDirect(
      txBuilder,
      account.account_number,
      fromAddress.toString(),
    );
    return signedTxBuilder;
  }

  //  Delete Delegate
  async undelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildUndelegate(
      keyType,
      validatorAddress,
      amount,
      gas,
      fee,
      publicKey,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToUndelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
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
    const simulatedTxBuilder = await this.buildUndelegate(
      keyType,
      validatorAddress,
      amount,
      dummyGas,
      dummyFee,
      publicKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildUndelegate(
    keyType: KeyType,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    publicKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const pubKey = createCosmosPublicKeyFromUint8Array(keyType, publicKey);
    if (!pubKey) {
      throw Error('Invalid publicKey!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
      .then(
        (res) =>
          res.data.account &&
          (cosmosclient.codec.unpackCosmosAny(
            res.data.account,
          ) as proto.cosmos.auth.v1beta1.BaseAccount),
      )
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    // build tx
    const msgDelegate = new proto.cosmos.staking.v1beta1.MsgUndelegate({
      delegator_address: fromAddress.toString(),
      validator_address: validatorAddress,
      amount,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDelegate)],
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
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signedTxBuilder = this.keplrAppService.signDirect(
      txBuilder,
      account.account_number,
      fromAddress.toString(),
    );
    return signedTxBuilder;
  }
}
