import { MaterialModule } from '../../../material.module';
import { VaultComponent } from './vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoinAmountPipe } from 'projects/portal/src/app/pipes/coin-amount.pipe';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [VaultComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    PipesModule,
  ],
  exports: [VaultComponent],
  providers: [CoinAmountPipe],
})
export class VaultModule {}
