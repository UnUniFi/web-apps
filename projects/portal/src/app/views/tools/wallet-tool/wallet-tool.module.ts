import { PipesModule } from '../../../pipes/pipes.module';
import { MaterialModule } from '../../material.module';
import { WalletToolComponent } from './wallet-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WalletToolComponent],
  imports: [CommonModule, MaterialModule, RouterModule, PipesModule],
  exports: [WalletToolComponent],
})
export class WalletToolModule {}
