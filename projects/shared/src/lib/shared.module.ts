import { SharedComponent } from './shared.component';
import { TxFeeConfirmDialogModule } from './views/dialogs/cosmos/tx/common/tx-fee-confirm-dialog/tx-fee-confirm-dialog.module';
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
import { MaterialModule } from './views/material.module';
import { LibViewNftsModule } from './views/nfts/nfts.module';
import { LibWidgetListNftFormDialogModule } from './widgets/dialogs/ununifi/tx/list-nft-form-dialog/list-nft-form-dialog.module';
import { LibWidgetNftMenuDialogModule } from './widgets/dialogs/ununifi/tx/nft-menu-dialog/nft-menu-dialog.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SharedComponent],
  imports: [
    MaterialModule,
    ConnectWalletCompletedDialogModule,
    ConnectWalletStartDialogModule,
    UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule,
    UnunifiBackupPrivateKeyWizardDialogModule,
    UnunifiCreateWalletFormDialogModule,
    UnunifiImportWalletWithMnemonicFormDialogModule,
    UnunifiImportWalletWithPrivateKeyFormDialogModule,
    UnunifiKeyFormDialogModule,
    UnunifiSelectCreateImportDialogModule,
    UnunifiSelectWalletDialogModule,
    LibViewNftsModule,
    LibWidgetNftMenuDialogModule,
    LibWidgetListNftFormDialogModule,
    TxFeeConfirmDialogModule,
  ],
  exports: [SharedComponent],
})
export class SharedModule {}
