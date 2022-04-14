import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi/api';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';

@Component({
  selector: 'app-delegate-menu-dialog',
  templateUrl: './delegate-menu-dialog.component.html',
  styleUrls: ['./delegate-menu-dialog.component.css'],
})
export class DelegateMenuDialogComponent implements OnInit {
  selectedValidator: InlineResponse20066Validators | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20066Validators,
    private router: Router,
    public matDialogRef: MatDialogRef<DelegateMenuDialogComponent>,
    private readonly stakingAppService: StakingApplicationService,
  ) {
    this.selectedValidator = data;
  }

  ngOnInit() {}

  onSubmitDelegate(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.stakingAppService.openDelegateFormDialog(validator);
  }

  onSubmitDetail(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.router.navigate(['delegate', 'validators', validator.operator_address]);
  }
}
