import { FaucetInfrastructureService } from './faucet.infrastructure.service';
import { FaucetRequest, FaucetResponse } from './faucet.model';
import { Injectable } from '@angular/core';

export interface InterfaceFaucetInfrastructureService {
  postFaucetRequest: (faucetRequest: FaucetRequest, faucetURL: string) => Promise<FaucetResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class FaucetService {
  constructor(private faucetInfrastructureService: FaucetInfrastructureService) {}

  postFaucetRequest(faucetRequest: FaucetRequest, faucetURL: string): Promise<FaucetResponse> {
    return this.faucetInfrastructureService.postFaucetRequest(faucetRequest, faucetURL);
  }
}
