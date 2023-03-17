import { MintComponent } from './mint.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MintComponent],
  imports: [CommonModule, FormsModule],
  exports: [MintComponent],
})
export class MintModule {}
