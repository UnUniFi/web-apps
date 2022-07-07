import { getCollateralParamsStream } from '../models/ununifi-rest.service';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';

export const getSpotPriceStream = (
  sdk: cosmosclient.CosmosSDK,
  collateralType: Observable<string>,
  cdpParams: Observable<ununifi.proto.ununifi.cdp.IParams>,
) => {
  return getCollateralParamsStream(collateralType, cdpParams).pipe(
    mergeMap((collateralParams) =>
      ununifi.rest.pricefeed.price(sdk, collateralParams.spot_market_id),
    ),
    map((res) => res.data.price!),
  );
};

export const getLiquidationPriceStream = (
  sdk: cosmosclient.CosmosSDK,
  collateralType: Observable<string>,
  cdpParams: Observable<ununifi.proto.ununifi.cdp.IParams>,
) => {
  return getCollateralParamsStream(collateralType, cdpParams).pipe(
    mergeMap((collateralParams) =>
      ununifi.rest.pricefeed.price(sdk, collateralParams.liquidation_market_id),
    ),
    map((res) => res.data.price!),
  );
};
