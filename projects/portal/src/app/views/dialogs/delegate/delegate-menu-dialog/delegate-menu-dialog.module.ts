import { DelegateMenuDialogComponent } from './delegate-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [DelegateMenuDialogComponent],
  imports: [CommonModule, PipesModule],
  exports: [DelegateMenuDialogComponent],
})
export class DelegateMenuDialogModule {}
