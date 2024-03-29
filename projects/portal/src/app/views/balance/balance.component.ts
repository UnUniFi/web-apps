import { WalletType } from '../../models/wallets/wallet.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class ViewBalanceComponent implements OnInit, OnChanges {
  @Input() walletId?: string | null;
  @Input() walletType?: WalletType | null;
  @Input() accAddress?: string | null;
  @Input() accountTypeName?: string | null;
  @Input() publicKey?: string | null;
  @Input() valAddress?: string | null;
  @Input() symbolImageMap?: { [symbol: string]: string };
  @Input() denomBalancesMap?: {
    [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  } | null;
  @Input() denomMetadataMap?: {
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  } | null;

  @Input() faucetSymbols?: string[] | null;
  @Input() faucets?:
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | null;
  @Input() nodeInfo?: GetNodeInfo200Response | null;
  @Input()
  account?: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount | unknown | null;
  baseAccount?: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount;
  vestingAccount?: cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount;

  // UYA unbonding
  @Input()
  strategies?:
    | {
        strategy: StrategyAll200ResponseStrategiesInner;
        unbonding?: string;
      }[]
    | null;
  @Input() strategySymbols?: { symbol: string; display: string; img: string }[] | null;
  @Input() usdUnbondingAmount?: number[] | null;
  @Input() usdTotalUnbondingAmount?: number | null;

  @Output() appWithdrawAllDelegatorReward: EventEmitter<{}>;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {
    this.appWithdrawAllDelegatorReward = new EventEmitter();
  }

  ngOnInit(): void {}

  ngOnChanges() {
    delete this.baseAccount;

    if (this.account instanceof cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount) {
      this.baseAccount = this.account;
    } else if (
      this.account instanceof cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    ) {
      this.vestingAccount = this.account;
      if (this.vestingAccount.base_vesting_account?.base_account === null) {
        throw Error('Invalid vesting account!');
      }
      this.baseAccount = new cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount(
        this.vestingAccount.base_vesting_account?.base_account,
      );
    }
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }
    return false;
  }

  onClickWithdrawAllDelegatorRewardButton() {
    this.appWithdrawAllDelegatorReward.emit();
  }

  onClickOpenAddressTxs() {
    const rootPath = window.location.origin;
    window.open(rootPath + '/explorer/accounts/' + this.accAddress, '_blank');
  }
}
