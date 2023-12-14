import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { AppDelegateFormDialogModule } from './pages/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.module';
import { AppDelegateMenuDialogModule } from './pages/dialogs/delegate/delegate-menu-dialog/delegate-menu-dialog.module';
import { AppRedelegateFormDialogModule } from './pages/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.module';
import { AppUndelegateFormDialogModule } from './pages/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.module';
import { AppWithdrawAllDelegatorRewardFormDialogModule } from './pages/dialogs/delegate/withdraw-all-delegator-reward-form-dialog/withdraw-all-delegator-reward-form-dialog.module';
import { AppWithdrawDelegatorRewardFormDialogModule } from './pages/dialogs/delegate/withdraw-delegator-reward-form-dialog/withdraw-delegator-reward-form-dialog.module';
import { AppWithdrawValidatorCommissionFormDialogModule } from './pages/dialogs/delegate/withdraw-validator-commission-form-dialog/withdraw-validator-commission-form-dialog.module';
import { AppCreateUnitFormDialogModule } from './pages/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.module';
import { AppWithdrawIncentiveAllRewardsFormDialogModule } from './pages/dialogs/incentive/withdraw-incentive-all-rewards-form-dialog/withdraw-incentive-all-rewards-form-dialog.module';
import { AppWithdrawIncentiveRewardFormDialogModule } from './pages/dialogs/incentive/withdraw-incentive-reward-form-dialog/withdraw-incentive-reward-form-dialog.module';
import { AppNftsDialogModule } from './pages/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.module';
import { AppDepositFormDialogModule } from './pages/dialogs/vote/deposit-form-dialog/deposit-form-dialog.module';
import { AppVoteFormDialogModule } from './pages/dialogs/vote/vote-form-dialog/vote-form-dialog.module';
import { InactiveValidatorModule } from './views/dialogs/delegate/invalid-validator-confirm-dialog/inactive-validator-confirm-dialog.module';
import { TxFeeConfirmDialogModule } from './views/dialogs/tx-fee-confirm/tx-fee-confirm-dialog.module';
import { TxConfirmDialogModule } from './views/dialogs/txs/tx-confirm/tx-confirm-dialog.module';
import { WithdrawFeeConfirmDialogModule } from './views/dialogs/txs/withdraw-fee-confirm/withdraw-fee-confirm-dialog.module';
import { ConnectExternalWalletDialogModule } from './views/dialogs/wallets/connect-external-cosmos-dialog/connect-external-wallet-dialog.module';
import { ConnectWalletCompletedDialogModule } from './views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.module';
import { ConnectWalletStartDialogModule } from './views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.module';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule } from './views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.module';
import { UnunifiBackupPrivateKeyWizardDialogModule } from './views/dialogs/wallets/ununifi/ununifi-backup-private-key-wizard-dialog/ununifi-backup-private-key-wizard-dialog.module';
import { UnunifiCreateWalletFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.module';
import { UnunifiImportWalletWithMnemonicFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.module';
import { UnunifiImportWalletWithPrivateKeyFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-import-wallet-with-private-key-form-dialog/ununifi-import-wallet-with-private-key-form-dialog.module';
import { UnunifiKeyFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-key-form-dialog/ununifi-key-form-dialog.module';
import { UnunifiSelectCreateImportDialogModule } from './views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.module';
import { UnunifiSelectWalletDialogModule } from './views/dialogs/wallets/ununifi/ununifi-select-wallet-dialog/ununifi-select-wallet-dialog.module';
import { KeyBackupDialogModule } from './views/keys/key-backup-dialog/key-backup-dialog.module';
import { KeyDeleteConfirmDialogModule } from './views/keys/key-delete-confirm-dialog/key-delete-confirm-dialog.module';
import { KeyDeleteDialogModule } from './views/keys/key-delete-dialog/key-delete-dialog.module';
import { KeySelectDialogModule } from './views/keys/key-select-dialog/key-select-dialog.module';
import { ToolbarModule } from './views/toolbar/toolbar.module';
import { ViewModule } from './views/view.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingDialogModule } from 'projects/shared/src/lib/components/loading-dialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingDialogModule,
    MatDialogModule,
    MatSnackBarModule,
    ViewModule,
    ToolbarModule,
    HttpClientModule,
    KeySelectDialogModule,
    KeyBackupDialogModule,
    KeyDeleteDialogModule,
    KeyDeleteConfirmDialogModule,
    TxFeeConfirmDialogModule,
    ConnectWalletCompletedDialogModule,
    ConnectWalletStartDialogModule,
    UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule,
    UnunifiBackupPrivateKeyWizardDialogModule,
    UnunifiCreateWalletFormDialogModule,
    UnunifiImportWalletWithMnemonicFormDialogModule,
    UnunifiImportWalletWithPrivateKeyFormDialogModule,
    UnunifiSelectCreateImportDialogModule,
    UnunifiSelectWalletDialogModule,
    UnunifiKeyFormDialogModule,
    InactiveValidatorModule,
    TxConfirmDialogModule,
    WithdrawFeeConfirmDialogModule,
    AppDelegateFormDialogModule,
    AppDelegateMenuDialogModule,
    AppRedelegateFormDialogModule,
    AppUndelegateFormDialogModule,
    AppWithdrawDelegatorRewardFormDialogModule,
    AppWithdrawAllDelegatorRewardFormDialogModule,
    AppWithdrawValidatorCommissionFormDialogModule,
    AppVoteFormDialogModule,
    AppDepositFormDialogModule,
    AppCreateUnitFormDialogModule,
    AppWithdrawIncentiveRewardFormDialogModule,
    AppWithdrawIncentiveAllRewardsFormDialogModule,
    AppNftsDialogModule,
    GraphQLModule,
    ConnectExternalWalletDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
