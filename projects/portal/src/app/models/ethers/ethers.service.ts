import { MetaMaskService } from '../wallets/metamask/metamask.service';
import { DepositToVaultFromEvmArg } from '../yield-aggregators/yield-aggregator.model';
import { IERC20Abi, depositToVaultAbi } from './ethers.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import {
//   AxelarQueryAPI,
//   AxelarQueryAPIFeeResponse,
//   Environment,
//   EvmChain,
// } from '@axelar-network/axelarjs-sdk';
// import { TransferFeeResponse } from '@axelar-network/axelarjs-types/axelar/nexus/v1beta1/query';
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
    chainName: string,
    contractAddress: string,
    tokenAddress: string,
    arg: DepositToVaultFromEvmArg,
    signerAddress?: string,
  ): Promise<string | undefined> {
    console.log('depositToVault', arg);

    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask extension.');
      return;
    }
    const amount = arg.amount;

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner(signerAddress);
    const latestPrice = await provider.getGasPrice();
    console.log('gasPrice', latestPrice.toString());
    const gasPrice = latestPrice.mul(2);

    const deposit = new ethers.Contract(contractAddress, depositToVaultAbi, signer);
    const usda = new ethers.Contract(tokenAddress, IERC20Abi, signer);

    try {
      const gateway = await deposit.gateway();
      console.log('gateway is ' + gateway);
    } catch (error) {
      console.error(error);
      this.snackBar.open(
        `Contract connection failed on ${chainName}. Check the network of wallet app.`,
        'Close',
      );
      return;
    }

    const blockNum = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNum);
    // const sdk = new AxelarQueryAPI({
    //   environment: Environment.TESTNET,
    // });
    const gasLimit = block.gasLimit;
    console.log('gasLimit', gasLimit.toString());

    // const gas = await sdk.estimateGasFee(
    //   'ethereum-2',
    //   arg.destinationChain,
    //   arg.erc20,
    //   gasLimit,
    //   1.1,
    // );
    // console.log(gas);
    const approvalDialogRef = this.loadingDialog.open('Waiting for approval...');
    try {
      const approveTx = await usda.approve(deposit.address, amount);
      await approveTx.wait();
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Contract connection failed: ${error}`, 'Close');
      return;
    } finally {
      approvalDialogRef.close();
    }

    const dialogRef = this.loadingDialog.open('Sending...');
    let tx;
    try {
      tx = await deposit.depositToVault(
        arg.destinationChain,
        arg.destinationAddress,
        arg.depositor,
        arg.vaultDenom,
        arg.vaultId,
        arg.erc20,
        amount,
        { gasPrice: gasPrice, gasLimit: gasLimit },
      );
      tx.wait();
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Contract connection failed: ${error}`, 'Close');
      return;
    } finally {
      dialogRef.close();
      return tx.hash;
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
