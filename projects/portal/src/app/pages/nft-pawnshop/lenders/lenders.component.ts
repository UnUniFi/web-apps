import { NftPawnshopApplicationService } from '../../../models/nft-pawnshops/nft-pawnshop.application.service';
import { NftPawnshopQueryService } from '../../../models/nft-pawnshops/nft-pawnshop.query.service';
import { NftPawnshopService } from '../../../models/nft-pawnshops/nft-pawnshop.service';
import { LendParams } from '../../../views/nft-pawnshop/lenders/lenders.component';
import { BalanceUsecaseService } from '../../balance/balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined>;
  listedClasses$: Observable<ListedClass200Response[]>;
  classImages$: Observable<string[]>;
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(
    private usecase: BalanceUsecaseService,
    private readonly pawnshop: NftPawnshopService,
    private readonly pawnshopApp: NftPawnshopApplicationService,
    private readonly pawnshopQuery: NftPawnshopQueryService,
  ) {
    this.balances$ = this.usecase.balances$;
    this.listedNfts$ = this.pawnshopQuery.listListedNfts();
    this.listedClasses$ = this.pawnshopQuery.getAllListedClasses();
    this.classImages$ = this.listedClasses$.pipe(
      mergeMap((classes) =>
        Promise.all(
          classes.map(async (nftClass) => {
            if (!nftClass.uri) {
              return '';
            }
            const imageUri = await this.pawnshop.getImageFromUri(nftClass.uri);
            return imageUri;
          }),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onViewClass(params: LendParams) {
    localStorage.setItem('lendAmount', params.deposit.amount.toString());
    localStorage.setItem('lendDenom', params.deposit.denom);
    localStorage.setItem('lendRate', params.interestRate.toString());
    localStorage.setItem('lendTerm', params.repaymentTerm.toISOString());
    this.pawnshopApp.openNftsDialog(params.classID);
  }
}
