import { StoredWallet } from '../wallet.model';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { WCClient } from '@cosmos-kit/walletconnect';

@Injectable({
  providedIn: 'root',
})
export class LeapService {
  wcClient = new WCClient({
    mobileDisabled: false,
    mode: 'wallet-connect',
    name: 'UnUniFi Portal',
    prettyName: '',
    walletconnect: {
      name: 'UnUniFi Portal',
      projectId: '',
    },
  });

  constructor() {}
}
