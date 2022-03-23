import { MaterialModule } from '../../material.module';
import { AccountsComponent } from './accounts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AccountsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [AccountsComponent],
})
export class AccountsModule {}
