import { txTitle } from './../models/cosmos/tx-common.model';
import { CosmosTxV1beta1Tx } from '@cosmos-client/core/esm/openapi/api';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse200Accounts } from '@cosmos-client/core/esm/openapi';

export const txParseMsgs = (tx: CosmosTxV1beta1Tx): txTitle[] | undefined => {
  return tx.body?.messages?.map(message => txParseMsg(message))
}

export const txParseProposalContent = (message: InlineResponse200Accounts)
  : cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined => {
  const content = cosmosclient.codec.protoJSONToInstance(cosmosclient.codec.castProtoJSONOfProtoAny(message))
  if (content instanceof cosmosclient.proto.cosmos.gov.v1beta1.TextProposal) {
    return content
  } else {
    return undefined
  }
}

export const txParseMsg = (message: InlineResponse200Accounts): txTitle => {
  const instance = cosmosclient.codec.protoJSONToInstance(cosmosclient.codec.castProtoJSONOfProtoAny(message))
  //staking module
  if (instance instanceof cosmosclient.proto.cosmos.staking.v1beta1.MsgEditValidator) return parseMsgEditValidator(instance)
  if (instance instanceof cosmosclient.proto.cosmos.staking.v1beta1.MsgCreateValidator) return parseMsgCreateValidator(instance)
  if (instance instanceof cosmosclient.proto.cosmos.staking.v1beta1.MsgUndelegate) return parseMsgUndelegate(instance)
  if (instance instanceof cosmosclient.proto.cosmos.staking.v1beta1.MsgBeginRedelegate) return parseMsgBeginRedelegate(instance)
  if (instance instanceof cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate) return parseMsgDelegate(instance)
  //gov module
  if (instance instanceof cosmosclient.proto.cosmos.gov.v1beta1.MsgSubmitProposal) return parseMsgSubmitProposal(instance)
  if (instance instanceof cosmosclient.proto.cosmos.gov.v1.MsgVoteWeighted) return parseMsgVoteWeighted(instance)
  if (instance instanceof cosmosclient.proto.cosmos.gov.v1.MsgVote) return parseMsgVote(instance)
  if (instance instanceof cosmosclient.proto.cosmos.gov.v1.MsgDeposit) return parseMsgDeposit(instance)
  //distribution module
  if (instance instanceof cosmosclient.proto.cosmos.distribution.v1beta1.MsgFundCommunityPool) return parseMsgFundCommunityPool(instance)
  if (instance instanceof cosmosclient.proto.cosmos.distribution.v1beta1.MsgSetWithdrawAddress) return parseMsgSetWithdrawAddress(instance)
  if (instance instanceof cosmosclient.proto.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward) return parseMsgWithdrawDelegatorReward(instance)
  if (instance instanceof cosmosclient.proto.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission) return parseMsgWithdrawValidatorCommission(instance)
  //vesting module
  if (instance instanceof cosmosclient.proto.cosmos.vesting.v1beta1.MsgCreateVestingAccount) return parseMsgCreateVestingAccount(instance)
  //bank module
  if (instance instanceof cosmosclient.proto.cosmos.bank.v1beta1.MsgSend) return parseMsgSend(instance)

  return {
    txType: "",
    fromAddress: "",
    toAddress: "",
    amount: ""
  };
}
const parseMsgDelegate = (instance: cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate): txTitle => {
  const denomAmount = instance.amount?.amount || ""
  const denom = instance.amount?.denom
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.delegator_address,
    toAddress: instance.validator_address,
    amount
  }
}
const parseMsgEditValidator = (instance: cosmosclient.proto.cosmos.staking.v1beta1.MsgEditValidator): txTitle => {
  const valAddressString = instance.validator_address
  const valAddress = cosmosclient.ValAddress.fromString(valAddressString)
  const accAddress = valAddress.toAccAddress().toString()
  return {
    txType: instance.constructor.name,
    fromAddress: accAddress,
    toAddress: instance.validator_address,
    amount: "------",
    description: instance.description,
    minimumSelfDelegation: instance.min_self_delegation,
    editedCommissionRate: instance.commission_rate
  }
}
const parseMsgCreateValidator = (instance: cosmosclient.proto.cosmos.staking.v1beta1.MsgCreateValidator): txTitle => {
  const denomAmount = instance.value?.amount || ""
  const denom = instance.value?.denom
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.delegator_address,
    toAddress: instance.validator_address,
    amount,
    description: instance.description,
    minimumSelfDelegation: instance.min_self_delegation,
    commission: instance.commission
  }
}
const parseMsgUndelegate = (instance: cosmosclient.proto.cosmos.staking.v1beta1.MsgUndelegate): txTitle => {
  const denomAmount = instance.amount?.amount || ""
  const denom = instance.amount?.denom
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.validator_address,
    toAddress: instance.delegator_address,
    amount,
  }
}
const parseMsgBeginRedelegate = (instance: cosmosclient.proto.cosmos.staking.v1beta1.MsgBeginRedelegate): txTitle => {
  const denomAmount = instance.amount?.amount || ""
  const denom = instance.amount?.denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.delegator_address,
    toAddress: instance.validator_dst_address,
    validatorDestinationAddress: instance.validator_dst_address,
    validatorSourceAddress: instance.validator_src_address,
    amount: denomAmount + " " + denom
  }
}
const parseMsgSubmitProposal = (instance: cosmosclient.proto.cosmos.gov.v1beta1.MsgSubmitProposal): txTitle => {
  const denomAmount = instance.initial_deposit?.[0].amount || ""
  const denom = instance.initial_deposit?.[0].denom
  const amount = denomAmount + denom
  const content = cosmosclient.codec.protoAnyToInstance(instance.content)
  if (content instanceof cosmosclient.proto.cosmos.gov.v1beta1.TextProposal) {
    return {
      txType: instance.constructor.name,
      fromAddress: instance.proposer,
      toAddress: "--------",
      amount,
      amounts: instance.initial_deposit,
      content
    }
  }
  return {
    txType: "",
    fromAddress: "",
    toAddress: "",
    amount: ""
  }
}
const parseMsgVoteWeighted = (instance: cosmosclient.proto.cosmos.gov.v1beta1.MsgVoteWeighted): txTitle => {
  const denomAmount = instance.options?.[0].weight || ""
  const denom = instance.options?.[0].weight
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.voter,
    toAddress: instance.proposal_id.toString(),
    amount,
    voteOptions: instance.options
  }
}
const parseMsgVote = (instance: cosmosclient.proto.cosmos.gov.v1beta1.MsgVote): txTitle => {
  return {
    txType: instance.constructor.name,
    fromAddress: instance.voter,
    toAddress: instance.proposal_id.toString(),
    amount: "",
    voteOption: instance.option
  }
}
const parseMsgDeposit = (instance: cosmosclient.proto.cosmos.gov.v1beta1.MsgDeposit): txTitle => {
  const denomAmount = instance.amount?.[0].amount || ""
  const denom = instance.amount?.[0].denom
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.depositor,
    toAddress: instance.proposal_id.toString(),
    amount,
    amounts: instance.amount
  }
}
const parseMsgFundCommunityPool = (instance: cosmosclient.proto.cosmos.distribution.v1beta1.MsgFundCommunityPool): txTitle => {
  const denomAmount = instance.amount?.[0].amount || ""
  const denom = instance.amount?.[0].denom
  const amount = denomAmount + " " + denom
  const coins = instance.amount
  return {
    txType: instance.constructor.name,
    fromAddress: instance.depositor,
    toAddress: "------",
    amount,
    amounts: coins
  }
}
const parseMsgSetWithdrawAddress = (instance: cosmosclient.proto.cosmos.distribution.v1beta1.MsgSetWithdrawAddress): txTitle => {
  return {
    txType: instance.constructor.name,
    fromAddress: instance.delegator_address,
    toAddress: instance.withdraw_address,
    amount: "------",
  }
}
const parseMsgWithdrawDelegatorReward = (instance: cosmosclient.proto.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward): txTitle => {
  return {
    txType: instance.constructor.name,
    fromAddress: instance.delegator_address,
    toAddress: instance.validator_address,
    amount: "------",
  }
}
const parseMsgWithdrawValidatorCommission = (instance: cosmosclient.proto.cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission): txTitle => {
  return {
    txType: instance.constructor.name,
    fromAddress: instance.validator_address,
    toAddress: "------",
    amount: "------",
  }
}
const parseMsgSend = (instance: cosmosclient.proto.cosmos.bank.v1beta1.MsgSend): txTitle => {
  const denomAmount = instance.amount?.[0].amount || ""
  const denom = instance.amount?.[0].denom
  const amount = denomAmount + " " + denom
  return {
    txType: instance.constructor.name,
    fromAddress: instance.from_address,
    toAddress: instance.to_address,
    amount
  }
}
const parseMsgCreateVestingAccount = (instance: cosmosclient.proto.cosmos.vesting.v1beta1.MsgCreateVestingAccount): txTitle => {
  const denomAmount = instance.amount?.[0].amount || ""
  const denom = instance.amount?.[0].denom
  const amount = denomAmount + " " + denom
  const endTime = new Date(Number(instance.end_time.toString()) * 1000)
  return {
    txType: instance.constructor.name,
    fromAddress: instance.from_address,
    toAddress: instance.to_address,
    amount,
    amounts: instance.amount,
    vestingDelayed: instance.delayed,
    vestingEndTime: endTime.toDateString()
  }
}
