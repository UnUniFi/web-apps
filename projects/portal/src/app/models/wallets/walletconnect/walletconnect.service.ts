import { Injectable } from '@angular/core';
import { Web3Modal } from '@web3modal/html';

@Injectable({
  providedIn: 'root',
})
export class WalletconnectService {
  web3modal = new Web3Modal({ projectId: '' }, {} as any);

  async openModal() {
    this.web3modal.subscribeEvents((event) => {
      console.log(event.userSessionId);

      switch (event.name) {
        case 'ACCOUNT_CONNECTED': {
          console.log(event.data);
        }
      }
    });
    await this.web3modal.openModal();
  }
}
