import { createCosmosPublicKeyFromUint8Array } from '../../utils/key';
import { KeyType } from '../keys/key.model';
import { WalletType } from '../wallets/wallet.model';
import { ExternalCosmosTxService } from './external-cosmos-tx.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class ExternalCosmosApplicationService {
  constructor(
    private readonly externalCosmosTxService: ExternalCosmosTxService,
    private readonly loadingDialog: LoadingDialogService,
    private readonly snackBar: MatSnackBar,
  ) {}

  async broadcast(
    chainName: string,
    address: string,
    walletType: WalletType,
    msg: any,
    pubkey: Uint8Array,
  ) {
    const cosmosPublicKey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, pubkey);
    if (!cosmosPublicKey) {
      console.error('Invalid Pubkey.');
      return;
    }
    const account = await this.externalCosmosTxService.getBaseAccountFromAddress(
      chainName,
      address,
    );
    if (!account) {
      this.snackBar.open(`Unsupported account type.`, 'Close');
      return null;
    }
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.externalCosmosTxService.buildTxBuilder(
        chainName,
        [msg], // TODO
        cosmosPublicKey,
        account,
      );

      const signerBaseAccount = await this.externalCosmosTxService.getBaseAccountFromAddress(
        chainName,
        address,
      );
      if (!signerBaseAccount) {
        throw Error('Unsupported Account!');
      }
      const signedTxBuilder = await this.externalCosmosTxService.signTx(
        chainName,
        txBuilder,
        signerBaseAccount,
        walletType,
      );
      if (!signedTxBuilder) {
        throw Error('Failed to sign!');
      }

      txResult = await this.externalCosmosTxService.announceTx(chainName, txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error(txResult?.tx_response?.raw_log);
      }
      return txHash;
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Tx broadcasting failed: ${(error as Error).toString()}`, 'Close');
      return null;
    } finally {
      dialogRef.close();
    }
  }
}
