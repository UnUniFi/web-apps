import { KeyService } from '../../../models/index';
import { Key } from '../../../models/keys/key.model';
import { KeyStoreService } from '../../../models/keys/key.store.service';
import { UnunifiRestService } from '../../../models/ununifi-rest.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-cdps',
  templateUrl: './cdps.component.html',
  styleUrls: ['./cdps.component.css'],
})
export class CdpsComponent implements OnInit {
  cdps$: Observable<(InlineResponse2004Cdp1 | undefined)[]>;

  constructor(
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly ununifiRest: UnunifiRestService,
  ) {
    const key$ = this.keyStore.currentKey$.asObservable();
    const address$ = key$.pipe(
      filter((key: Key | undefined): key is Key => key !== undefined),
      map((key: Key) =>
        cosmosclient.AccAddress.fromPublicKey(this.key.getPubKey(key.type, key.public_key)),
      ),
    );

    const collateralTypes$ = this.ununifiRest
      .getCdpParams$()
      .pipe(map((res) => res?.collateral_params?.map((p) => p.type!) || []));

    this.cdps$ = combineLatest([address$, collateralTypes$]).pipe(
      mergeMap(([address, collateralTypes]) =>
        combineLatest(
          collateralTypes.map((collateralType) =>
            this.ununifiRest.getCdp$(address, collateralType),
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
