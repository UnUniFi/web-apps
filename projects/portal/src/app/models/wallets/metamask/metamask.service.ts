import { StoredWallet } from '../wallet.model';
import { MetaMaskInfrastructureService } from './metamask.infrastructure.service';
import { Injectable } from '@angular/core';

export interface IMetaMaskInfrastructureService {
  connectWallet: () => Promise<StoredWallet | null | undefined>;
  // Todo: Currently, I don't know what kind of type should be return. But, I set Uint8Array temporally.
  signWithMetaMask: (unsignedData: unknown) => Promise<Uint8Array | null | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class MetaMaskService {
  private readonly iMetaMaskInfrastructureService: IMetaMaskInfrastructureService;

  constructor(readonly metaMaskInfrastructureService: MetaMaskInfrastructureService) {
    this.iMetaMaskInfrastructureService = this.metaMaskInfrastructureService;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    return await this.iMetaMaskInfrastructureService.connectWallet();
  }

  // Todo: Currently, I don't know what kind of type should be return. But, I set Uint8Array temporally.
  async signWithMetaMask(unsignedData: unknown): Promise<Uint8Array | null | undefined> {
    return await this.iMetaMaskInfrastructureService.signWithMetaMask(unsignedData);
  }
}
