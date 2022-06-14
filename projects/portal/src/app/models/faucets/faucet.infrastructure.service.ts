import { FaucetRequest, FaucetResult } from './faucet.model';
import { InterfaceFaucetInfrastructureService } from './faucet.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

type FaucetResponse = {
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class FaucetInfrastructureService implements InterfaceFaucetInfrastructureService {
  constructor(private http: HttpClient) {}

  async postFaucetRequest(faucetRequest: FaucetRequest, faucetURL: string): Promise<FaucetResult> {
    const faucetResult: FaucetResult = {
      isSuccess: false,
      errorMessage: '',
    };

    try {
      const requestBody = {
        address: faucetRequest.address,
        coins: faucetRequest.coins.map((coin) => coin.amount + coin.denom),
      };
      if (faucetURL !== undefined) {
        const faucetResponse: FaucetResponse = await this.http
          .post<FaucetResponse>(faucetURL, requestBody)
          .toPromise();

        if (!faucetResponse.error) {
          faucetResult.isSuccess = true;
          faucetResult.errorMessage = '';
        } else {
          faucetResult.isSuccess = false;
          faucetResult.errorMessage = faucetResponse.error;
        }

        // Todo: This is not confirmed yet. But, in previous version of faucet, this was necessary.
        // Note: In this case, the response message is timeout error but, tx is success in most cases.
        if (faucetResponse.error?.includes('Error: RPC error -32603')) {
          faucetResult.isSuccess = true;
        }
      } else {
        throw Error('Invalid faucetURL!');
      }
    } catch (error) {
      console.error(error);
      faucetResult.isSuccess = false;
      if (error instanceof Error) {
        faucetResult.errorMessage = error.message;
      }
      if (error instanceof HttpErrorResponse) {
        faucetResult.errorMessage = error.error.error;
        if (!faucetResult.errorMessage) {
          faucetResult.errorMessage = error.message;
        }
      }
      // Todo: This is not confirmed yet. But, in previous version of faucet, this was necessary.
      // Note: In this case, the response message is timeout error but, tx is success in most cases.
      if (faucetResult.errorMessage.includes('Error: RPC error -32603')) {
        faucetResult.isSuccess = true;
      }
    }

    return faucetResult;
  }
}
