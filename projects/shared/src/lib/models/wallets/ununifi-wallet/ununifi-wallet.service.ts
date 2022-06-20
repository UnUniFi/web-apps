import { StoredWallet } from '../wallet.model';
import { UnunifiWalletInfrastructureService } from './ununifi-wallet.infrastructure.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';

export interface IUnunifiWalletInfrastructureService {
  connectWallet(): Promise<boolean>;
  signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder>;
  signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class UnunifiWalletService {
  private readonly iUnunifiWalletInfrastructureService: IUnunifiWalletInfrastructureService;

  constructor(readonly ununifiWalletInfrastructureService: UnunifiWalletInfrastructureService) {
    this.iUnunifiWalletInfrastructureService = this.ununifiWalletInfrastructureService;
  }

  async connectWallet(): Promise<boolean> {
    return await this.iUnunifiWalletInfrastructureService.connectWallet();
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    return await this.iUnunifiWalletInfrastructureService.signTx(txBuilder, signerBaseAccount);
  }

  async signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey?: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    return await this.iUnunifiWalletInfrastructureService.signTxWithPrivateKey(
      txBuilder,
      signerBaseAccount,
      privateKey,
    );
  }
}
