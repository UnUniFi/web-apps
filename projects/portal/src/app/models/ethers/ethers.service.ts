import { ExternalTxConfirmDialogComponent } from '../../views/dialogs/txs/external-tx-confirm/external-tx-confirm-dialog.component';
import { TxConfirmDialogData } from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { MetaMaskService } from '../wallets/metamask/metamask.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { tx } from '@cosmos-client/core/cjs/rest/tx';
import { ethers } from 'ethers';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(
    readonly metaMaskService: MetaMaskService,
    private readonly loadingDialog: LoadingDialogService,
    private readonly dialog: Dialog,
  ) {}

  async connectContract(
    contractAddress: string,
    contractAbi: any[],
    functionName: string,
    arg: any,
  ) {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask extension.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      contractAddress,
      contractAbi, // artifacts/contracts/xxx.sol/xxx.json
      signer,
    );

    let txn = await connectedContract[functionName](arg);
    const dialogRef = this.loadingDialog.open('Mining');
    await txn.wait();
    dialogRef.close();

    await this.dialog
      .open<TxConfirmDialogData>(ExternalTxConfirmDialogComponent, {
        data: { txHash: txn.hash, msg: 'Deposit to the vault was successful.' },
      })
      .closed.toPromise();
    location.reload();
  }
}
