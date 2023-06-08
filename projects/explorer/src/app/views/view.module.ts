import { AppNodeToolModule } from '../pages/tools/node-tool/node-tool.module';
import { AppSearchToolModule } from '../pages/tools/search-tool/search-tool.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    AppNodeToolModule,
    AppSearchToolModule,
  ],
  exports: [AppComponent],
})
export class ViewModule {}
