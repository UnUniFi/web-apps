import { UnunifiRestService } from '../../models/ununifi-rest.service';
import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InlineResponse2002Params } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
})
export class AuctionComponent implements OnInit {
  params$: Observable<InlineResponse2002Params>;
  constructor(private ununifiRest: UnunifiRestService) {
    this.params$ = timer(0, 60 * 1000).pipe(mergeMap(() => this.ununifiRest.getAuctionParams$()));
  }

  ngOnInit(): void {}
}
