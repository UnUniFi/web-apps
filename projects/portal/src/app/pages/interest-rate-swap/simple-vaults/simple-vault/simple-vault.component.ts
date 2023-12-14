import { Component, OnInit } from '@angular/core';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintPtRequest } from 'projects/portal/src/app/models/irs/irs.model';

@Component({
  selector: 'app-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  constructor(private readonly irsAppService: IrsApplicationService) {}

  ngOnInit(): void {}

  onMintPT(data: MintPtRequest) {
    this.irsAppService.mintPT(data);
  }
}
