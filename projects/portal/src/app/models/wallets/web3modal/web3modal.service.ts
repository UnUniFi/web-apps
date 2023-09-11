import { Web3ModalInfrastructureService } from './web3modal.infrastructure.service';
import { Injectable } from '@angular/core';
import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

export interface IWeb3ModalInfrastructureService {
  getEvmWalletManager: () => {
    ethereumClient: EthereumClient;
    web3modal: Web3Modal;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Web3ModalService {
  private readonly iWeb3ModalInfrastructureService: IWeb3ModalInfrastructureService;

  constructor(readonly web3ModalInfrastructureService: Web3ModalInfrastructureService) {
    this.iWeb3ModalInfrastructureService = this.web3ModalInfrastructureService;
  }

  getEvmWalletManager() {
    return this.iWeb3ModalInfrastructureService.getEvmWalletManager();
  }
}
