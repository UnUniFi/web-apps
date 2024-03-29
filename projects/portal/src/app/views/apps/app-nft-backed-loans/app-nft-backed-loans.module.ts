import { AppAppToolModule } from '../../../pages/tools/app-tool/app-tool.module';
import { AppNodeToolModule } from '../../../pages/tools/node-tool/node-tool.module';
import { AppWalletToolModule } from '../../../pages/tools/wallet-tool/wallet-tool.module';
import { MaterialModule } from '../../material.module';
import { AppNftBackedLoansComponent } from './app-nft-backed-loans.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppNftBackedLoansComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    AppAppToolModule,
    AppNodeToolModule,
    AppWalletToolModule,
  ],
  exports: [AppNftBackedLoansComponent],
})
export class AppNftBackedLoansModule {}
