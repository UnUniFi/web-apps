import { MaterialModule } from '../../material.module';
import { SearchToolComponent } from './search-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchToolComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [SearchToolComponent],
})
export class SearchToolModule {}
