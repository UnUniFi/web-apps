import { TraderComponent } from './trader.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TraderComponent],
  imports: [CommonModule, FormsModule],
  exports: [TraderComponent],
})
export class TraderModule {}
