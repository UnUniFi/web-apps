import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Proposals200ResponseProposalsInner } from '@cosmos-client/core/esm/openapi';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { VoteOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/vote/vote/vote-form-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vote-form-dialog',
  templateUrl: './vote-form-dialog.component.html',
  styleUrls: ['./vote-form-dialog.component.css'],
})
export class VoteFormDialogComponent implements OnInit {
  proposal$: Observable<Proposals200ResponseProposalsInner | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  proposalID: number | undefined;
  proposalContent$: Observable<any | undefined>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: number,
    public dialogRef: DialogRef<string, VoteFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.proposalID = data;
    this.proposal$ = this.cosmosRest.getProposal$(String(this.proposalID));
    this.proposalContent$ = this.proposal$.pipe(map((proposal) => proposal && proposal.content));
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

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
    this.dialogRef.close(txHash);
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
    this.dialogRef.close(txHash);
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
    this.dialogRef.close(txHash);
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
    this.dialogRef.close(txHash);
  }
}
