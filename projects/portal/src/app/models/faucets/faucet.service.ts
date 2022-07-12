import { FaucetInfrastructureService } from './faucet.infrastructure.service';
import { FaucetRequest, FaucetResult } from './faucet.model';
import { Injectable } from '@angular/core';

export interface InterfaceFaucetInfrastructureService {
  postFaucetRequest: (faucetRequest: FaucetRequest, faucetURL: string) => Promise<FaucetResult>;
}

@Injectable({
  providedIn: 'root',
})
export class FaucetService {
  constructor(private faucetInfrastructureService: FaucetInfrastructureService) {}

  postFaucetRequest(faucetRequest: FaucetRequest, faucetURL: string): Promise<FaucetResult> {
    return this.faucetInfrastructureService.postFaucetRequest(faucetRequest, faucetURL);
  }
}
