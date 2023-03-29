import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { WalletService } from '../wallets/wallet.service';
import { DerivativesService } from './derivatives.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class DerivativesApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletService: WalletService,
    private readonly bankQueryService: BankQueryService,
    private readonly derivativesService: DerivativesService,
    private readonly txCommonApplication: TxCommonApplicationService,
  ) {}

  async mintLiquidityProviderToken(symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.derivativesService.buildMsgMintLiquidityProviderToken(
      address,
      symbol,
      amount,
      symbolMetadataMap,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    // this.snackBar.open('Successfully minted liquidity provider token.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully purchased DLP. Please check your balance. When you sell this, you will earn fee income.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['derivatives', 'pool']);
    }
  }

  async burnLiquidityProviderToken(amount: number, redeemSymbol: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.derivativesService.buildMsgBurnLiquidityProviderToken(
      address,
      amount,
      redeemSymbol,
      symbolMetadataMap,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    // this.snackBar.open('Successfully burned liquidity provider token.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully sold yor DLP. Please check your balance.' },
        })
        .closed.toPromise();
      this.router.navigate(['derivatives', 'pool']);
    }
  }

  async openPerpetualFuturesPosition(
    marginSymbol: string,
    marginAmount: number,
    baseSymbol: string,
    quoteSymbol: string,
    positionType: ununificlient.proto.ununifi.derivatives.PositionType,
    size: number,
    leverage: number,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const perpetualFuturesPositionInstance =
      this.derivativesService.buildPerpetualFuturesPositionInstance(
        baseSymbol,
        positionType,
        size * 10 ** 12,
        leverage,
        symbolMetadataMap,
      );

    const positionInstance: cosmosclient.proto.google.protobuf.IAny =
      cosmosclient.codec.instanceToProtoAny(perpetualFuturesPositionInstance);

    const msg = this.derivativesService.buildMsgOpenPosition(
      address,
      marginSymbol,
      marginAmount,
      baseSymbol,
      quoteSymbol,
      positionInstance,
      symbolMetadataMap,
    );

    // comment-out simulate
    // const simulationResult = await this.txCommonApplication.simulate(
    //   msg,
    //   publicKey,
    //   account,
    //   minimumGasPrice,
    // );
    // if (!simulationResult) {
    //   return;
    // }
    // const { gas, fee } = simulationResult;

    // if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
    //   return;
    // }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
    );
    if (!txHash) {
      return;
    }

    // this.snackBar.open('Successfully opened position.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully created the position. A swap fee is deducted from the margin every 24 hours.',
          },
        })
        .closed.toPromise();
    }
  }

  async closePosition(positionId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.derivativesService.buildMsgClosePosition(address, positionId);

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    // this.snackBar.open('Successfully closed position.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully closed the position. Please check your balance.',
          },
        })
        .closed.toPromise();
    }
  }
}
