import { FaucetRequest, FaucetResponse } from './faucet.model';
import { InterfaceFaucetInfrastructureService } from './faucet.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FaucetInfrastructureService implements InterfaceFaucetInfrastructureService {
  constructor(private configS: ConfigService, private http: HttpClient) {}

  async postFaucetRequest(faucetRequest: FaucetRequest): Promise<FaucetResponse> {
    const requestBody = {
      address: faucetRequest.address,
      coins: faucetRequest.coins.map((coin) => coin.amount + coin.denom),
    };
    const faucetURL = this.getFaucetURL(faucetRequest.coins[0].denom);
    return faucetURL
      .pipe(
        map((url) => {
          if (url) {
            return this.http.post<FaucetResponse>(url, requestBody).toPromise();
          } else {
            return {
              transfers: [],
            };
          }
        }),
      )
      .toPromise();
  }

  getFaucetURL(denom: string): Observable<string | undefined> {
    return this.configS.config$.pipe(
      map(
        (config) => config?.extension?.faucet?.find((faucet) => faucet.denom === denom)?.faucetURL,
      ),
    );
  }
}
