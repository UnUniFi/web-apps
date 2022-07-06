import { Component, OnInit } from '@angular/core';
import { QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod } from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validators$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;

  constructor(private cosmosRest: CosmosRestService) {
    this.validators$ = this.cosmosRest.getValidators$();
  }

  ngOnInit() {}
}
