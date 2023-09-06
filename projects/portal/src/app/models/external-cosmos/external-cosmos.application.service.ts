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
    id: string,
    walletType: string,
    msg: any,
    cosmosPublicKey: cosmosclient.PubKey,
    baseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.externalCosmosTxService.buildTxBuilder(
        id,
        [msg], // TODO
        cosmosPublicKey,
        baseAccount,
      );

      const signerBaseAccount = await this.externalCosmosTxService.getBaseAccount(
        id,
        cosmosPublicKey,
      );
      if (!signerBaseAccount) {
        throw Error('Unsupported Account!');
      }
      const signedTxBuilder = await this.externalCosmosTxService.signTx(
        id,
        txBuilder,
        signerBaseAccount,
        walletType,
      );
      if (!signedTxBuilder) {
        throw Error('Failed to sign!');
      }

      txResult = await this.externalCosmosTxService.announceTx(id, txBuilder);
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
