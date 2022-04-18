import { FaucetRequest } from './faucet.model';
import { FaucetService } from './faucet.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class FaucetApplicationService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly faucetService: FaucetService,
  ) {}

  async postFaucetRequest(faucetRequest: FaucetRequest, faucetURL: string) {
    const dialogRef = this.loadingDialog.open('Claiming...');

    this.faucetService
      .postFaucetRequest(faucetRequest, faucetURL)
      .then((faucetResponse) => {
        console.log(faucetResponse);
        if (faucetResponse.transfers.length > 0) {
          const resultList = faucetResponse.transfers.map((transfer) => {
            if (transfer.status === 'ok') {
              return true;
            } else if (transfer.error?.includes('Error: RPC error -32603')) {
              // Note: In this case, the response message is timeout error but, tx is success in most cases.
              return true;
            } else {
              return false;
            }
          });
          const result = resultList.every((element) => element === true);
          const errorMessage = resultList
            .filter((element) => element === false)
            .map((_element, index) => {
              return faucetResponse.transfers[index]?.error;
            })
            .join();
          if (result) {
            // Note: In Error: RPC error -32603 case, need to wait.
            const waitSecondsDialogRef = this.loadingDialog.open('Waiting...');
            this.waitSeconds(5).then(() => {
              waitSecondsDialogRef.close();
              this.snackBar.open('Success', undefined, { duration: 3000 });
              this.router.navigate(['/']);
            });
          } else {
            this.snackBar.open(`Failed: ${errorMessage}`, 'Close');
          }
        } else {
          this.snackBar.open('Failed', 'Close');
        }
      })
      .catch((error) => {
        console.error(error);
        this.snackBar.open(`Failed: ${error.message}`, 'Close');
      })
      .finally(() => {
        dialogRef.close();
      });
  }

  private async waitSeconds(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
