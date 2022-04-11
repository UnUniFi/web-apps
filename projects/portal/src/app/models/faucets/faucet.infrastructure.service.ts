import { FaucetRequest, FaucetResponse } from './faucet.model';
import { InterfaceFaucetInfrastructureService } from './faucet.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';

@Injectable({
  providedIn: 'root',
})
export class FaucetInfrastructureService implements InterfaceFaucetInfrastructureService {
  constructor(private configS: ConfigService, private http: HttpClient) {}

  async postFaucetRequest(
    faucetRequest: FaucetRequest,
    faucetURL: string,
  ): Promise<FaucetResponse> {
    const requestBody = {
      address: faucetRequest.address,
      coins: faucetRequest.coins.map((coin) => coin.amount + coin.denom),
    };
    if (faucetURL !== undefined) {
      return this.http.post<FaucetResponse>(faucetURL, requestBody).toPromise();
    } else {
      return {
        transfers: [],
      };
    }
  }

  // getFaucetURL(denom: string): Observable<string | undefined> {
  //   return this.configS.config$.pipe(
  //     map(
  //         (config) =>
  //           config?.extension?.faucet?.find((faucet) => faucet.denom === denom)?.faucetURL,
  //       ),
  //     )
  //     .toPromise();
  // }
}
