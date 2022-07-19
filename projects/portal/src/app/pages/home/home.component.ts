import { CosmosRestService } from '../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { InlineResponse20012 } from '@cosmos-client/core/esm/openapi';
import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  nodeInfo$: Observable<InlineResponse20012>;
  syncing$: Observable<boolean>;

  constructor(private cosmosRest: CosmosRestService) {
    const timer$ = timer(0, 60 * 60 * 1000);
    this.nodeInfo$ = timer$.pipe(mergeMap(() => this.cosmosRest.getNodeInfo$()));
    this.syncing$ = timer$.pipe(mergeMap(() => this.cosmosRest.getSyncing$()));
  }

  ngOnInit() {}
}
