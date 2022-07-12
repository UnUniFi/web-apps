import { Nft } from '../../models/ununifi/query/nft/nft.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-view-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class LibViewNftsComponent implements OnInit {
  @Input() nfts?: Nft[] | null;
  @Input() menuEnabled?: boolean;

  constructor() {}

  ngOnInit(): void {}
}
