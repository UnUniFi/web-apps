import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';

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

  @Output()
  appSubmit: EventEmitter<ListRequest>;

  constructor() {
    this.bidSymbol = 'GUU';
    this.minDepositRate = 5;
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void { }

  onSubmit() {
    this.appSubmit.emit({
      classID: this.classID!,
      nftID: this.nftID!,
      bidSymbol: this.bidSymbol,
      minimumDepositRate: this.minDepositRate / 100,
      autoRefinancing: true,
    });
  }
}
