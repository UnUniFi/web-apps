import { StoredWallet } from '../wallet.model';
import { KeplrInfrastructureService } from './keplr.infrastructure.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

export interface IKeplrInfrastructureService {
  connectWallet: () => Promise<StoredWallet | null | undefined>;
  signTx: (
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ) => Promise<cosmosclient.TxBuilder>;
  checkWallet: () => Promise<StoredWallet | null | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class KeplrService {
  private readonly iKeplrInfrastructureService: IKeplrInfrastructureService;

  constructor(readonly keplrInfrastructureService: KeplrInfrastructureService) {
    this.iKeplrInfrastructureService = this.keplrInfrastructureService;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    return await this.iKeplrInfrastructureService.connectWallet();
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    return await this.iKeplrInfrastructureService.signTx(txBuilder, signerBaseAccount);
  }

  async checkWallet(): Promise<StoredWallet | null | undefined> {
    return await this.iKeplrInfrastructureService.checkWallet();
  }
}
