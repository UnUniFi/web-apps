import { NFT } from '../../models/cosmos/nfts/nft.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-view-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class LibViewNftsComponent implements OnInit {
  @Input() nfts?: NFT[] | null;

  constructor() {}

  ngOnInit(): void {}
}
