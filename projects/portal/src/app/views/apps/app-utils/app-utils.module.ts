import { AppAppToolModule } from '../../../pages/tools/app-tool/app-tool.module';
import { AppNodeToolModule } from '../../../pages/tools/node-tool/node-tool.module';
import { AppSearchToolModule } from '../../../pages/tools/search-tool/search-tool.module';
import { AppWalletToolModule } from '../../../pages/tools/wallet-tool/wallet-tool.module';
import { MaterialModule } from '../../material.module';
import { AppUtilsComponent } from './app-utils.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppUtilsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    AppAppToolModule,
    AppNodeToolModule,
    AppWalletToolModule,
    AppSearchToolModule,
  ],
  exports: [AppUtilsComponent],
})
export class AppUtilsModule {}
