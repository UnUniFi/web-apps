import { AppAppToolModule } from '../../../pages/tools/app-tool/app-tool.module';
import { AppNodeToolModule } from '../../../pages/tools/node-tool/node-tool.module';
import { AppWalletToolModule } from '../../../pages/tools/wallet-tool/wallet-tool.module';
import { MaterialModule } from '../../material.module';
import { AppDerivativesComponent } from './app-derivatives.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppDerivativesComponent],
  imports: [CommonModule, MaterialModule, AppAppToolModule, AppNodeToolModule, AppWalletToolModule],
  exports: [AppDerivativesComponent],
})
export class AppDerivativesModule {}
