import { convertUnknownAccountToBaseAccount } from '../../utils/converter';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { KeyType } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import { cosmos } from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class GovService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
  ) {}

  // WIP Submit Proposal
  async SubmitProposal(
    keyType: KeyType,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildSubmitProposal(keyType, gas, fee, privateKey);
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToSubmitProposal(
    keyType: KeyType,
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
    const simulatedTxBuilder = await this.buildSubmitProposal(
      keyType,
      dummyGas,
      dummyFee,
      privateKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildSubmitProposal(
    keyType: KeyType,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(keyType, privateKey);
    if (!privKey) {
      throw Error('Invalid privateKey!');
    }
    const pubKey = privKey.pubKey();
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
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

    // build tx
    const msgProposal = new proto.cosmos.gov.v1beta1.MsgSubmitProposal({
      content: null,
      initial_deposit: [],
      proposer: fromAddress.toString(),
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.instanceToProtoAny(msgProposal)],
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
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '1000000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(baseAccount.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  // Vote
  async Vote(
    proposalID: number,
    voteOption: proto.cosmos.gov.v1beta1.VoteOption,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildVoteTxBuilder(
      proposalID,
      voteOption,
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

  async simulateToVote(
    proposalID: number,
    voteOption: proto.cosmos.gov.v1beta1.VoteOption,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
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
    const simulatedTxBuilder = await this.buildVoteTxBuilder(
      proposalID,
      voteOption,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildVoteTxBuilder(
    proposalID: number,
    voteOption: proto.cosmos.gov.v1beta1.VoteOption,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgVote = this.buildMsgVote(proposalID, fromAddress.toString(), voteOption);
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgVote],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildMsgVote(
    proposalID: number,
    voterAddress: string,
    voteOption: proto.cosmos.gov.v1beta1.VoteOption,
  ): proto.cosmos.gov.v1beta1.MsgVote {
    const msgVote = new proto.cosmos.gov.v1beta1.MsgVote({
      proposal_id: cosmosclient.Long.fromNumber(proposalID),
      voter: voterAddress,
      option: voteOption,
    });
    return msgVote;
  }

  // Deposit
  async Deposit(
    proposalID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildDepositTxBuilder(
      proposalID,
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

  async simulateToDeposit(
    proposalID: number,
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
    const simulatedTxBuilder = await this.buildDepositTxBuilder(
      proposalID,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildDepositTxBuilder(
    proposalID: number,
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

    // build tx
    const msgDeposit = this.buildMsgDeposit(proposalID, fromAddress.toString(), amount);
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgDeposit],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildMsgDeposit(
    proposalID: number,
    depositerAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
  ): proto.cosmos.gov.v1beta1.MsgDeposit {
    const msgDeposit = new proto.cosmos.gov.v1beta1.MsgDeposit({
      proposal_id: cosmosclient.Long.fromNumber(proposalID),
      depositor: depositerAddress,
      amount: [amount],
    });
    return msgDeposit;
  }
}
