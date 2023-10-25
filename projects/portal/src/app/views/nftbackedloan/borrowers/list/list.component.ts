import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/portal/src/app/models/nft/nft.model';
import { min } from 'rxjs/operators';

@Component({
  selector: 'view-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;

  bidSymbol: string;
  minDepositRate: number;
  minExpiryDate: number;

  @Output()
  appSubmit: EventEmitter<ListRequest>;

  constructor() {
    this.bidSymbol = 'GUU';
    this.minDepositRate = 5;
    this.minExpiryDate = 180;
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.appSubmit.emit({
      classID: this.classID!,
      nftID: this.nftID!,
      bidSymbol: this.bidSymbol,
      minimumDepositRate: this.minDepositRate / 100,
      milliSeconds: this.minExpiryDate * 24 * 60 * 60 * 1000,
    });
  }
}
