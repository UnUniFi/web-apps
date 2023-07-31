import { SearchInfo } from '../../../pages/nftbackedloan/nfts/nfts.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  @Input() listedNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input() nftsMetadata?: Metadata[] | null;
  @Input() images?: string[] | null;
  @Input() keyword?: string | null;
  @Input() state?: string | null;
  @Input() interestRate?: number | null;
  @Input() date?: string | null;
  @Input() time?: string | null;
  @Input() isSearchBoxOpened?: boolean | null;
  @Output()
  searchNfts = new EventEmitter<SearchInfo>();
  @Output()
  refresh = new EventEmitter<{}>();

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.keyword === null || this.state === null || this.date === null || this.time === null) {
      return;
    }
    this.searchNfts.emit({
      keyword: this.keyword,
      state: this.state,
      // interestRate: this.interestRate,
      date: this.date,
      time: this.time,
    });
  }

  onRefresh() {
    this.refresh.emit();
  }
}
