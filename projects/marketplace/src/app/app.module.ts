import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { ToolbarModule } from './views/toolbar/toolbar.module';
import { ViewModule } from './views/view.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingDialogModule } from 'projects/shared/src/lib/components/loading-dialog';
import { TxFeeConfirmDialogModule } from 'projects/shared/src/lib/views/dialogs/cosmos/tx/common/tx-fee-confirm-dialog/tx-fee-confirm-dialog.module';
import { ConnectWalletCompletedDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.module';
import { ConnectWalletStartDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.module';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.module';
import { UnunifiBackupPrivateKeyWizardDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-backup-private-key-wizard-dialog/ununifi-backup-private-key-wizard-dialog.module';
import { UnunifiCreateWalletFormDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.module';
import { UnunifiImportWalletWithMnemonicFormDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.module';
import { UnunifiImportWalletWithPrivateKeyFormDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-import-wallet-with-private-key-form-dialog/ununifi-import-wallet-with-private-key-form-dialog.module';
import { UnunifiKeyFormDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-key-form-dialog/ununifi-key-form-dialog.module';
import { UnunifiSelectCreateImportDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.module';
import { UnunifiSelectWalletDialogModule } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-select-wallet-dialog/ununifi-select-wallet-dialog.module';
import { LibWidgetListNftFormDialogModule } from 'projects/shared/src/lib/widgets/dialogs/ununifi/tx/list-nft-form-dialog/list-nft-form-dialog.module';
import { LibWidgetNftMenuDialogModule } from 'projects/shared/src/lib/widgets/dialogs/ununifi/tx/nft-menu-dialog/nft-menu-dialog.module';

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
    TxFeeConfirmDialogModule,
    LibWidgetListNftFormDialogModule,
    LibWidgetNftMenuDialogModule,
    GraphQLModule,
  ],
  providers: [
    {
      provide: 'configs',
      useValue: environment.configs,
    },
    {
      provide: 'port',
      useValue: environment.port,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
