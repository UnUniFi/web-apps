import { Component, Input, OnInit } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  @Input()
  listedNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input()
  nftsMetadata?: Metadata[] | null;
  @Input()
  images?: string[] | null;

  isSearchBoxOpened: boolean = false;
  keyword?: string;
  state?: string;
  interestRate?: number;
  date?: string;
  time?: string;

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {}
}
