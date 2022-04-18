import { DelegateMenuDialogComponent } from './delegate-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegateMenuDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/delegate-menu-dialog/delegate-menu-dialog.module';

@NgModule({
  declarations: [DelegateMenuDialogComponent],
  imports: [CommonModule, DelegateMenuDialogModule],
})
export class AppDelegateMenuDialogModule {}
