import {
  BaseAccount,
  BaseVestingAccount,
  ContinuousVestingAccount,
  DelayedVestingAccount,
  ModuleAccount,
  PeriodicVestingAccount,
  PermanentLockedAccount,
} from './Account';
import {
  convertHexStringToUint8Array,
  convertTypedAccountToTypedName,
  convertUint8ArrayToHexString,
  convertUnknownAccountToBaseAccount,
  convertUnknownAccountToTypedAccount,
} from './converter';

describe('convertHexStringToUint8Array', () => {
  it('convert hex string to uint8array', () => {
    const hexString = 'bada55';
    const uint8Array = convertHexStringToUint8Array(hexString);
    expect(uint8Array).toEqual(new Uint8Array([186, 218, 85]));
  });

  it('returns undefined when passing an empty string', () => {
    const hexString = '';
    const uint8Array = convertHexStringToUint8Array(hexString);
    expect(uint8Array).toBeUndefined();
  });
});

describe('convertUint8ArrayToHexString', () => {
  it('convert uint8array to hex string', () => {
    const uint8Array = new Uint8Array([186, 218, 85]);
    const hexString = convertUint8ArrayToHexString(uint8Array);
    expect(hexString).toEqual('bada55');
  });

  it('returns empty string when passing an empty uint8array', () => {
    const uint8Array = new Uint8Array([]);
    const hexString = convertUint8ArrayToHexString(uint8Array);
    expect(hexString).toBe('');
  });
});

describe('convertUnknownAccountToTypedAccount', () => {
  it('convert unknown account to typed account', () => {
    const unknownAccount = new BaseAccount();
    const typedAccount = convertUnknownAccountToTypedAccount(unknownAccount);
    expect(typedAccount).toEqual(unknownAccount);
  });

  it('convert invalid data to undefined', () => {
    const unknownAccount = 'hoge';
    const typedAccount = convertUnknownAccountToTypedAccount(unknownAccount);
    expect(typedAccount).toBeUndefined();
  });
});

describe('convertUnknownAccountToBaseAccount', () => {
  const setup = () => {
    const baseAccount = new BaseAccount({ address: '0x123' });
    const baseVestingAccount = new BaseVestingAccount({ base_account: baseAccount });
    return { baseAccount, baseVestingAccount };
  };

  it('convert BaseAccount to base account', () => {
    const { baseAccount } = setup();
    const typedAccount = convertUnknownAccountToBaseAccount(baseAccount);
    expect(typedAccount).toEqual(baseAccount);
    expect(typedAccount?.address).toBe(baseAccount.address);
  });

  it('convert BaseVestingAccount to base account', () => {
    const { baseAccount, baseVestingAccount } = setup();
    const typedAccount = convertUnknownAccountToBaseAccount(baseVestingAccount);
    expect(typedAccount).toEqual(baseAccount);
    expect(typedAccount?.address).toBe(baseAccount.address);
  });

  it('convert PermanentLockedAccount to base account', () => {
    const { baseAccount } = setup();
    const unknownAccount = new ModuleAccount({
      base_account: baseAccount,
    });
    const typedAccount = convertUnknownAccountToBaseAccount(unknownAccount);
    expect(typedAccount).toEqual(baseAccount);
    expect(typedAccount?.address).toBe(baseAccount.address);
  });

  it.each`
    Account
    ${ContinuousVestingAccount}
    ${DelayedVestingAccount}
    ${PeriodicVestingAccount}
    ${PermanentLockedAccount}
  `('convert $Account to base account', ({ Account }) => {
    const { baseAccount, baseVestingAccount } = setup();
    const unknownAccount = new Account({ base_vesting_account: baseVestingAccount });
    const typedAccount = convertUnknownAccountToBaseAccount(unknownAccount);
    expect(typedAccount).toEqual(baseAccount);
    expect(typedAccount?.address).toBe(baseAccount.address);
  });

  it.each`
    arg          | expected
    ${'hoge'}    | ${undefined}
    ${undefined} | ${undefined}
    ${null}      | ${null}
  `('convert $arg to $expected', ({ arg, expected }) => {
    const typedAccount = convertUnknownAccountToBaseAccount(arg);
    expect(typedAccount).toEqual(expected);
  });
});

describe('convertTypedAccountToTypedName', () => {
  it.each`
    Account                     | name
    ${BaseAccount}              | ${'BaseAccount'}
    ${BaseVestingAccount}       | ${'BaseVestingAccount'}
    ${ContinuousVestingAccount} | ${'ContinuousVestingAccount'}
    ${DelayedVestingAccount}    | ${'DelayedVestingAccount'}
    ${PeriodicVestingAccount}   | ${'PeriodicVestingAccount'}
    ${PermanentLockedAccount}   | ${'PermanentLockedAccount'}
    ${ModuleAccount}            | ${'ModuleAccount'}
  `('convert $Account to $name', ({ Account, name }) => {
    const account = new Account();
    const typedAccount = convertTypedAccountToTypedName(account);
    expect(typedAccount).toEqual(name);
  });

  it.each`
    arg          | expected
    ${'hoge'}    | ${undefined}
    ${undefined} | ${undefined}
    ${null}      | ${null}
  `('convert $arg to $expected', ({ arg, expected }) => {
    const typedAccount = convertTypedAccountToTypedName(arg);
    expect(typedAccount).toEqual(expected);
  });
});
