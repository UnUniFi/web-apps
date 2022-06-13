import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    PortalMaterialModule,
    ToolbarModule,
  ],
  exports: [AppComponent],
})
export class ViewModule {}
