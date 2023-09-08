import { MetaMaskService } from '../wallets/metamask/metamask.service';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(
    readonly metaMaskService: MetaMaskService,
    private readonly loadingDialog: LoadingDialogService,
  ) {}

  async connectContract(
    contractAddress: string,
    contractAbi: any[],
    functionName: string,
    arg: any,
    signerAddress?: string,
  ): Promise<string | undefined> {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask extension.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner(signerAddress);

    const connectedContract = new ethers.Contract(
      contractAddress,
      contractAbi, // artifacts/contracts/xxx.sol/xxx.json
      signer,
    );

    let txn = await connectedContract[functionName](arg);
    const dialogRef = this.loadingDialog.open('Mining');
    await txn.wait();
    dialogRef.close();

    return txn.hash;
  }
}
