import { AppAppToolModule } from '../../../pages/tools/app-tool/app-tool.module';
import { AppNodeToolModule } from '../../../pages/tools/node-tool/node-tool.module';
import { AppWalletToolModule } from '../../../pages/tools/wallet-tool/wallet-tool.module';
import { AppInterestRateSwapComponent } from './app-interest-rate-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppInterestRateSwapComponent],
  imports: [CommonModule, RouterModule, AppAppToolModule, AppNodeToolModule, AppWalletToolModule],
  exports: [AppInterestRateSwapComponent],
})
export class AppInterestRateSwapModule {}
