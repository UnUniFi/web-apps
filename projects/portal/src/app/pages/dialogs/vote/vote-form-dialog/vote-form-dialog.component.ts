import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20027Proposals } from '@cosmos-client/core/esm/openapi';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { VoteOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/vote/vote/vote-form-dialog.component';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { txParseProposalContent } from 'projects/explorer/src/app/utils/tx-parser';

@Component({
  selector: 'app-vote-form-dialog',
  templateUrl: './vote-form-dialog.component.html',
  styleUrls: ['./vote-form-dialog.component.css'],
})
export class VoteFormDialogComponent implements OnInit {
  proposal$: Observable<InlineResponse20027Proposals | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  proposalID: number | undefined;
  proposalContent$: Observable<cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: number,
    public matDialogRef: MatDialogRef<VoteFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.proposalID = data;
    this.proposal$ = this.cosmosRest.getProposal$(String(this.proposalID));
    this.proposalContent$ = this.proposal$.pipe(
      map((proposal) => txParseProposalContent(proposal?.content!))
    );
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));

    this.uguuBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == 'uguu');
        return balance ? balance.amount! : '0';
      }),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void { }

  async onSubmitYes($event: VoteOnSubmitEvent) {
    if (!this.proposalID) {
      return;
    }
    const txHash = await this.govAppService.Vote(
      this.proposalID,
      cosmosclient.proto.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_YES,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
  async onSubmitNoWithVeto($event: VoteOnSubmitEvent) {
    if (!this.proposalID) {
      return;
    }
    const txHash = await this.govAppService.Vote(
      this.proposalID,
      cosmosclient.proto.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO_WITH_VETO,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
  async onSubmitNo($event: VoteOnSubmitEvent) {
    if (!this.proposalID) {
      return;
    }
    const txHash = await this.govAppService.Vote(
      this.proposalID,
      cosmosclient.proto.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_NO,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
  async onSubmitAbstain($event: VoteOnSubmitEvent) {
    if (!this.proposalID) {
      return;
    }
    const txHash = await this.govAppService.Vote(
      this.proposalID,
      cosmosclient.proto.cosmos.gov.v1beta1.VoteOption.VOTE_OPTION_ABSTAIN,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
