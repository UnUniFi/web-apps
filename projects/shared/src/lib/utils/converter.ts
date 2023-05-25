import {
  BaseAccount,
  BaseVestingAccount,
  ContinuousVestingAccount,
  DelayedVestingAccount,
  ModuleAccount,
  PeriodicVestingAccount,
  PermanentLockedAccount,
} from './Account';

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
  | BaseAccount
  | BaseVestingAccount
  | ContinuousVestingAccount
  | DelayedVestingAccount
  | PeriodicVestingAccount
  | PermanentLockedAccount
  | ModuleAccount
  | null
  | undefined => {
  if (unknownAccount instanceof BaseAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof BaseVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof ContinuousVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof DelayedVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof PeriodicVestingAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof PermanentLockedAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof ModuleAccount) {
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
): BaseAccount | null | undefined => {
  if (unknownAccount === undefined) {
    return unknownAccount;
  } else if (unknownAccount === null) {
    return unknownAccount;
  } else if (unknownAccount instanceof BaseAccount) {
    return unknownAccount;
  } else if (unknownAccount instanceof BaseVestingAccount) {
    if (unknownAccount.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_account);
  } else if (unknownAccount instanceof ContinuousVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_vesting_account?.base_account);
  } else if (unknownAccount instanceof DelayedVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_vesting_account?.base_account);
  } else if (unknownAccount instanceof PeriodicVestingAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_vesting_account?.base_account);
  } else if (unknownAccount instanceof PermanentLockedAccount) {
    if (unknownAccount.base_vesting_account?.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_vesting_account?.base_account);
  } else if (unknownAccount instanceof ModuleAccount) {
    if (unknownAccount.base_account === null) {
      return undefined;
    }
    return new BaseAccount(unknownAccount.base_account);
  } else {
    console.error('Unsupported Account!');
    console.error(unknownAccount);
    return undefined;
  }
};

export const convertTypedAccountToTypedName = (
  unknownAccount:
    | BaseAccount
    | BaseVestingAccount
    | ContinuousVestingAccount
    | DelayedVestingAccount
    | PeriodicVestingAccount
    | PermanentLockedAccount
    | ModuleAccount
    | null
    | undefined,
): string | null | undefined => {
  if (unknownAccount instanceof BaseAccount) {
    return 'BaseAccount';
  } else if (unknownAccount instanceof BaseVestingAccount) {
    return 'BaseVestingAccount';
  } else if (unknownAccount instanceof ContinuousVestingAccount) {
    return 'ContinuousVestingAccount';
  } else if (unknownAccount instanceof DelayedVestingAccount) {
    return 'DelayedVestingAccount';
  } else if (unknownAccount instanceof PeriodicVestingAccount) {
    return 'PeriodicVestingAccount';
  } else if (unknownAccount instanceof PermanentLockedAccount) {
    return 'PermanentLockedAccount';
  } else if (unknownAccount instanceof ModuleAccount) {
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
