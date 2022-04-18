import { FaucetRequest, FaucetResponse } from './faucet.model';
import { InterfaceFaucetInfrastructureService } from './faucet.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FaucetInfrastructureService implements InterfaceFaucetInfrastructureService {
  constructor(private http: HttpClient) {}

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
      throw Error('Invalid faucetURL!');
    }
  }
}
