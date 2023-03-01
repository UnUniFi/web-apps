import { FaucetRequest, FaucetResult } from './faucet.model';
import { FaucetService } from './faucet.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

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
    const faucetResult: FaucetResult = await this.faucetService.postFaucetRequest(
      faucetRequest,
      faucetURL,
    );
    if (faucetResult.isSuccess) {
      // Note: In Error: RPC error -32603 case, need to wait.
      const waitSecondsDialogRef = this.loadingDialog.open('Waiting...');
      await this.waitSeconds(5);
      waitSecondsDialogRef.close();
      this.snackBar.open('Success', undefined, { duration: 3000 });
      this.router.navigate(['/']);
    } else {
      this.snackBar.open(`Failed: ${faucetResult.errorMessage}`, 'Close');
    }
    dialogRef.close();
  }

  private async waitSeconds(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
