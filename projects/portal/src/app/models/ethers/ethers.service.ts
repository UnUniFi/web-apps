import { MetaMaskService } from '../wallets/metamask/metamask.service';
import { DepositToVaultFromEvmArg } from '../yield-aggregators/yield-aggregator.model';
import { IERC20Abi, depositToVaultAbi } from './ethers.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { parseUnits } from '@ethersproject/units';
import { ethers } from 'ethers';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor(
    readonly metaMaskService: MetaMaskService,
    private readonly loadingDialog: LoadingDialogService,
    private readonly snackBar: MatSnackBar,
  ) {}

  async depositToVault(
    contractAddress: string,
    tokenAddress: string,
    arg: DepositToVaultFromEvmArg,
    signerAddress?: string,
  ): Promise<string | undefined> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Please install MetaMask extension.');
        return;
      }
      const amount = arg.amount * 10 ** 6;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(signerAddress);
      const gasPrice = await provider.getGasPrice();
      console.log('gasPrice', gasPrice.toString());

      const deposit = new ethers.Contract(contractAddress, depositToVaultAbi, signer);
      const usda = new ethers.Contract(tokenAddress, IERC20Abi, signer);
      console.log(`decimals is ${await usda.decimals}`);
      console.log(`gateway is ${await deposit.gateway()}`);

      const blockNum = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNum);
      const gasLimit = block.gasLimit;

      // const estimatedGasLimit = await connectedContract.estimateGas[functionName](
      //   arg.destinationChain,
      //   arg.destinationAddress,
      //   arg.depositor,
      //   arg.vaultDenom,
      //   arg.vaultId,
      //   arg.erc20,
      //   parseUnits(arg.amount.toString()),
      //   { gasPrice: gasPrice, gasLimit: parseUnits('0.01') },
      // );
      // console.log('estimatedGasLimit', estimatedGasLimit);

      const approveTx = await usda.approve(deposit.address, amount);
      const dialogRef = this.loadingDialog.open('Waiting for approval...');
      await approveTx.wait();
      dialogRef.close();
      const sendTx = await deposit.depositToVault(
        arg.destinationChain,
        arg.destinationAddress,
        arg.depositor,
        arg.vaultDenom,
        arg.vaultId,
        arg.erc20,
        amount,
        { gasPrice: gasPrice, gasLimit: gasLimit },
      );
      const tx = sendTx.wait();
      return tx.hash;
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Contract connection failed: ${error}`, 'Close');
      return;
    }
  }

  async send(
    contractAddress: string,
    contractAbi: any[],
    distChain: string,
    distAddress: string,
    message: string,
    signerAddress?: string,
  ): Promise<string | undefined> {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Please install MetaMask extension.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(signerAddress);
      const gasPrice = await provider.getGasPrice();
      console.log('gasPrice', gasPrice.toString());

      const connectedContract = new ethers.Contract(
        contractAddress,
        contractAbi, // artifacts/contracts/xxx.sol/xxx.json
        signer,
      );

      const blockNum = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNum);
      const gasLimit = block.gasLimit;

      let tx = await connectedContract.send(distChain, distAddress, message, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });
      tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Contract connection failed: ${error}`, 'Close');
      return;
    }
  }
}
