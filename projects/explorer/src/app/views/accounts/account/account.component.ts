import { Component, OnInit, Input, OnChanges } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnChanges {
  @Input()
  account?: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | unknown | null;

  @Input()
  balances?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  baseAccount?: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount;
  vestingAccount?: cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount;
  publicKey?: string;

  txColumnKeys = ['height', 'txhash', 'timestamp', 'gas_wanted', 'gas_used'];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    delete this.baseAccount;

    if (this.account instanceof cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount) {
      this.baseAccount = this.account;
      // Todo: fix pub_key zero issue and convert bech32 format
      const publicKey = cosmosclient.codec.protoAnyToInstance(this.baseAccount.pub_key);
      if (!(publicKey instanceof cosmosclient.proto.cosmos.crypto.secp256k1.PubKey)) {
        throw Error('Invalid public key!');
      }
      this.publicKey = Buffer.from(publicKey.key).toString('hex');
    } else if (this.account instanceof cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount) {
      this.vestingAccount = this.account;
      if (this.vestingAccount.base_vesting_account?.base_account === null) {
        throw Error('Invalid vesting account!');
      }
      this.baseAccount = new cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount(
        this.vestingAccount.base_vesting_account?.base_account,
      );
      // Todo: fix pub_key zero issue and convert bech32 format
      const publicKey = cosmosclient.codec.protoAnyToInstance(this.baseAccount.pub_key);
      if (!(publicKey instanceof cosmosclient.proto.cosmos.crypto.secp256k1.PubKey)) {
        throw Error('Invalid public key!');
      }
      this.publicKey = Buffer.from(publicKey.key).toString('hex');
    }
  }
}
