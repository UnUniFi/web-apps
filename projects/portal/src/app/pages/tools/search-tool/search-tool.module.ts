import { SearchToolModule } from '../../../views/tools/search-tool/search-tool.module';
import { SearchToolComponent } from './search-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SearchToolComponent],
  imports: [CommonModule, SearchToolModule],
})
export class AppSearchToolModule {}
