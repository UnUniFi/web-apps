import { StoredWallet } from '../wallet.model';
import { LeapInfrastructureService } from './leap.infrastructure.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Key } from '@keplr-wallet/types';

export interface ILeapInfrastructureService {
  connectWallet: () => Promise<StoredWallet | null | undefined>;
  connectExternalWallet: (id: string) => Promise<Key | null | undefined>;
  signTx: (
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ) => Promise<cosmosclient.TxBuilder>;
  checkWallet: () => Promise<StoredWallet | null | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class LeapService {
  private readonly iLeapInfrastructureService: ILeapInfrastructureService;

  constructor(readonly LeapInfrastructureService: LeapInfrastructureService) {
    this.iLeapInfrastructureService = this.LeapInfrastructureService;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    return await this.iLeapInfrastructureService.connectWallet();
  }

  async connectExternalWallet(id: string): Promise<Key | null | undefined> {
    return await this.iLeapInfrastructureService.connectExternalWallet(id);
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    return await this.iLeapInfrastructureService.signTx(txBuilder, signerBaseAccount);
  }

  async checkWallet(): Promise<StoredWallet | null | undefined> {
    return await this.iLeapInfrastructureService.checkWallet();
  }
}
