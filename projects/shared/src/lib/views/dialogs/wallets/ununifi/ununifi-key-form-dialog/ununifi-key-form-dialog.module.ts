import { MaterialModule } from '../../../../material.module';
import { UnunifiKeyFormDialogComponent } from './ununifi-key-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiKeyFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UnunifiKeyFormDialogComponent],
})
export class UnunifiKeyFormDialogModule {}
