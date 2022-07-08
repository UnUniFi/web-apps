import cosmosClient from '@cosmos-client/core';

export type BaseAccount = cosmosClient.proto.cosmos.auth.v1beta1.BaseAccount;
export const BaseAccount = cosmosClient.proto.cosmos.auth.v1beta1.BaseAccount;
export type BaseVestingAccount = cosmosClient.proto.cosmos.vesting.v1beta1.BaseVestingAccount;
export const BaseVestingAccount = cosmosClient.proto.cosmos.vesting.v1beta1.BaseVestingAccount;
export type ContinuousVestingAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount;
export const ContinuousVestingAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount;
export type DelayedVestingAccount = cosmosClient.proto.cosmos.vesting.v1beta1.DelayedVestingAccount;
export const DelayedVestingAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.DelayedVestingAccount;
export type PeriodicVestingAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.PeriodicVestingAccount;
export const PeriodicVestingAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.PeriodicVestingAccount;
export type PermanentLockedAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.PermanentLockedAccount;
export const PermanentLockedAccount =
  cosmosClient.proto.cosmos.vesting.v1beta1.PermanentLockedAccount;
export type ModuleAccount = cosmosClient.proto.cosmos.auth.v1beta1.ModuleAccount;
export const ModuleAccount = cosmosClient.proto.cosmos.auth.v1beta1.ModuleAccount;
