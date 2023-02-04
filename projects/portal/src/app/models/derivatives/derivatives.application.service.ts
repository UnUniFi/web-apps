import { CreateUnitFormDialogComponent } from '../../pages/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { ConfigService } from '../config.service';
import { BankQueryService } from '../cosmos/bank.query.service';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { DerivativesService } from './derivatives.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { map, take } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class DerivativesApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
    private readonly bankQueryService: BankQueryService,
    private readonly derivativesService: DerivativesService,
    private readonly txCommon: TxCommonService,
    private readonly config: ConfigService,
  ) {}

  async mintLiquidityProviderToken(symbol: string, amount: number) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    // create msg
    const msg = this.derivativesService.buildMsgMintLiquidityProviderToken(
      address,
      symbol,
      amount,
      symbolMetadataMap,
    );

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );
      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Successfully opened position.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async burnLiquidityProviderToken(amount: number, redeemSymbol: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    // create msg
    const msg = this.derivativesService.buildMsgBurnLiquidityProviderToken(
      address,
      amount,
      redeemSymbol,
      symbolMetadataMap,
    );

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );
      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Successfully opened position.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    // create IAny Instance
    const perpetualFuturesPositionInstance =
      this.derivativesService.buildPerpetualFuturesPositionInstance(
        baseSymbol,
        positionType,
        size,
        leverage,
        symbolMetadataMap,
      );

    const positionInstance = cosmosclient.codec.instanceToProtoAny(
      perpetualFuturesPositionInstance,
    );

    const msg = this.derivativesService.buildMsgOpenPosition(
      address,
      marginSymbol,
      marginAmount,
      baseSymbol,
      quoteSymbol,
      positionInstance,
      symbolMetadataMap,
    );

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );
      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Successfully opened position.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async closePosition(positionId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    // create msg
    const msg = this.derivativesService.buildMsgClosePosition(address, positionId);

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );
      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Successfully opened position.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }
}
