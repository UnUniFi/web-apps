import { WalletType } from '../../models/wallets/wallet.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class ViewBalanceComponent implements OnInit {
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
  @Output() appWithdrawAllDelegatorReward: EventEmitter<{}>;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {
    this.appWithdrawAllDelegatorReward = new EventEmitter();
  }

  ngOnInit(): void {}

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
