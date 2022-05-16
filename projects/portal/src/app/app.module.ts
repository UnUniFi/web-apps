import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { AppDelegateFormDialogModule } from './pages/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.module';
import { AppDelegateMenuDialogModule } from './pages/dialogs/delegate/delegate-menu-dialog/delegate-menu-dialog.module';
import { AppRedelegateFormDialogModule } from './pages/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.module';
import { AppUndelegateFormDialogModule } from './pages/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.module';
import { AppDepositFormDialogModule } from './pages/dialogs/vote/deposit-form-dialog/deposit-form-dialog.module';
import { AppVoteFormDialogModule } from './pages/dialogs/vote/vote-form-dialog/vote-form-dialog.module';
import { reducers, metaReducers } from './reducers';
import { TxFeeConfirmDialogModule } from './views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.module';
import { InactiveValidatorModule } from './views/dialogs/delegate/invalid-validator-confirm-dialog/inactive-validator-confirm-dialog.module';
import { ConnectWalletCompletedDialogModule } from './views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.module';
import { ConnectWalletStartDialogModule } from './views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.module';
import { KeplrImportWalletDialogModule } from './views/dialogs/wallets/keplr/keplr-import-wallet-dialog/keplr-import-wallet-dialog.module';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule } from './views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.module';
import { UnunifiCreateWalletFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.module';
import { UnunifiImportWalletWithMnemonicFormDialogModule } from './views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.module';
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
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingDialogModule } from 'ng-loading-dialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
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
    UnunifiCreateWalletFormDialogModule,
    UnunifiImportWalletWithMnemonicFormDialogModule,
    UnunifiSelectCreateImportDialogModule,
    UnunifiSelectWalletDialogModule,
    UnunifiKeyFormDialogModule,
    KeplrImportWalletDialogModule,
    InactiveValidatorModule,
    AppDelegateFormDialogModule,
    AppDelegateMenuDialogModule,
    AppRedelegateFormDialogModule,
    AppUndelegateFormDialogModule,
    AppVoteFormDialogModule,
    AppDepositFormDialogModule,
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
