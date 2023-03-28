import { WalletToolModule } from '../../../views/tools/wallet-tool/wallet-tool.module';
import { WalletToolComponent } from './wallet-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [WalletToolComponent],
  imports: [CommonModule, WalletToolModule],
  exports: [WalletToolComponent],
})
export class AppWalletToolModule {}
