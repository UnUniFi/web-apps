import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConnectExternalCosmosDialogComponent } from './connect-external-cosmos-dialog.component';

@NgModule({
  declarations: [ConnectExternalCosmosDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectExternalCosmosDialogComponent],
})
export class ConnectExternalCosmosDialogModule {}
