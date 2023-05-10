import { ValidatorUseCaseService } from './validator.usecase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { validatorType } from 'projects/portal/src/app/views/delegate/validators/validators.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  validatorAddress$: Observable<string>;
  validator$: Observable<validatorType | undefined>;
  accAddress$: Observable<cosmosclient.AccAddress | undefined>;

  constructor(private route: ActivatedRoute, private usecase: ValidatorUseCaseService) {
    this.validatorAddress$ = this.route.params.pipe(map((params) => params.address));
    const validatorAddress$ = this.validatorAddress$.pipe(
      map((addr) => cosmosclient.ValAddress.fromString(addr)),
    );
    this.accAddress$ = this.usecase.accAddress$(validatorAddress$);
    this.validator$ = this.usecase.validator$(validatorAddress$);
  }

  ngOnInit() {}
}
