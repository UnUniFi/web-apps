import { WalletType } from '../../models/wallets/wallet.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  InlineResponse20012,
} from '@cosmos-client/core/esm/openapi';

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
  @Input() balances?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input() rewards?: CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | null;
  @Input() faucets?:
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | null;
  @Input() nodeInfo?: InlineResponse20012 | null;
  @Output() appWithdrawAllDelegatorReward: EventEmitter<{}>;

  // Todo: This is temporal fix.
  tempNodeInfo: any;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {
    // Todo: This is temporal fix.
    this.tempNodeInfo = this.nodeInfo as any;
    this.appWithdrawAllDelegatorReward = new EventEmitter();
  }

  ngOnInit(): void {}

  // Todo: This lifecycle methods is temporal fix.
  // default_node_info in type definition of InlineResponse20012 is actually node_info.
  // It should be resolved with UnUniFi/chain or @cosmos-client/core, I guess.
  // But this is necessary for user to know which network is connected now.
  // So, currently, I convert it as any.
  // But this is not good.
  ngOnChanges(): void {
    this.tempNodeInfo = this.nodeInfo as any;
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
}
