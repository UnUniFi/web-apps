import { AppAppToolModule } from '../../../pages/tools/app-tool/app-tool.module';
import { AppNodeToolModule } from '../../../pages/tools/node-tool/node-tool.module';
import { AppWalletToolModule } from '../../../pages/tools/wallet-tool/wallet-tool.module';
import { MaterialModule } from '../../material.module';
import { AppYieldAggregatorComponent } from './app-yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppYieldAggregatorComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    AppAppToolModule,
    AppNodeToolModule,
    AppWalletToolModule,
  ],
  exports: [AppYieldAggregatorComponent],
})
export class AppYieldAggregatorModule {}
