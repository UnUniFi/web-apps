import { createCosmosPublicKeyFromUint8Array } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { ILeapInfrastructureService } from './leap.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class LeapInfrastructureService implements ILeapInfrastructureService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {}
  async connectWallet(): Promise<StoredWallet | null | undefined> {
    return null;
  }

  async checkWallet(): Promise<StoredWallet | null | undefined> {
    return null;
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signDoc = txBuilder.signDoc(signerBaseAccount.account_number);

    return txBuilder;
  }
}
