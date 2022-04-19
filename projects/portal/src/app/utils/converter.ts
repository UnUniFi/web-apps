import { proto } from '@cosmos-client/core';

export const convertHexStringToUint8Array = (hexString: string): Uint8Array | undefined => {
  try {
    const hexStringWithNoWhitespace = hexString.replace(/\s+/g, '');
    const buffer = Buffer.from(hexStringWithNoWhitespace, 'hex');
    const uint8Array = Uint8Array.from(buffer);
    if (uint8Array.length == 0) {
      return undefined;
    }
    return uint8Array;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const convertUint8ArrayToHexString = (uint8Array: Uint8Array): string | undefined => {
  try {
    const hexString: string = Buffer.from(uint8Array).toString('hex');
    return hexString;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const convertUnknownAccountToTypedAccount = (
  unknownAccount: unknown,
):
  | proto.cosmos.auth.v1beta1.BaseAccount
  | proto.cosmos.vesting.v1beta1.BaseVestingAccount
  | proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
  | proto.cosmos.vesting.v1beta1.DelayedVestingAccount
  | proto.cosmos.vesting.v1beta1.PeriodicVestingAccount
  | proto.cosmos.vesting.v1beta1.PermanentLockedAccount
  | proto.cosmos.auth.v1beta1.ModuleAccount
  | null
  | undefined => {
  if (unknownAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.BaseVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.ContinuousVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.DelayedVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PeriodicVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PermanentLockedAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.auth.v1beta1.ModuleAccount) {
    return unknownAccount;
  } else if (unknownAccount === undefined) {
    return unknownAccount;
  } else if (unknownAccount === null) {
    return unknownAccount;
  } else {
    console.error('Unsupported Account!');
    console.error(unknownAccount);
    return undefined;
  }
};

export const convertUnknownAccountToBaseAccount = (
  unknownAccount: unknown,
): proto.cosmos.auth.v1beta1.BaseAccount | null | undefined => {
  if (unknownAccount === undefined) {
    return unknownAccount;
  } else if (unknownAccount === null) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.BaseVestingAccount) {
    if (unknownAccount.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(unknownAccount.base_account);
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.ContinuousVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(
      unknownAccount.base_vesting_account?.base_account,
    );
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.DelayedVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(
      unknownAccount.base_vesting_account?.base_account,
    );
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PeriodicVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(
      unknownAccount.base_vesting_account?.base_account,
    );
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PermanentLockedAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(
      unknownAccount.base_vesting_account?.base_account,
    );
  } else if (unknownAccount instanceof proto.cosmos.auth.v1beta1.ModuleAccount) {
    if (unknownAccount.base_account === null) {
      return undefined;
    }
    return new proto.cosmos.auth.v1beta1.BaseAccount(unknownAccount.base_account);
  } else {
    console.error('Unsupported Account!');
    console.error(unknownAccount);
    return undefined;
  }
};

export const convertTypedAccountToTypedName = (
  unknownAccount:
    | proto.cosmos.auth.v1beta1.BaseAccount
    | proto.cosmos.vesting.v1beta1.BaseVestingAccount
    | proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    | proto.cosmos.vesting.v1beta1.DelayedVestingAccount
    | proto.cosmos.vesting.v1beta1.PeriodicVestingAccount
    | proto.cosmos.vesting.v1beta1.PermanentLockedAccount
    | proto.cosmos.auth.v1beta1.ModuleAccount
    | null
    | undefined,
): string | null | undefined => {
  if (unknownAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
    return 'BaseAccount';
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.BaseVestingAccount) {
    return 'BaseVestingAccount';
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.ContinuousVestingAccount) {
    return 'ContinuousVestingAccount';
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.DelayedVestingAccount) {
    return 'DelayedVestingAccount';
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PeriodicVestingAccount) {
    return 'PeriodicVestingAccount';
  } else if (unknownAccount instanceof proto.cosmos.vesting.v1beta1.PermanentLockedAccount) {
    return 'PermanentLockedAccount';
  } else if (unknownAccount instanceof proto.cosmos.auth.v1beta1.ModuleAccount) {
    return 'ModuleAccount';
  } else if (unknownAccount === undefined) {
    return unknownAccount;
  } else if (unknownAccount === null) {
    return unknownAccount;
  } else {
    console.error('Unsupported Account!');
    console.error(unknownAccount);
    return undefined;
  }
};
