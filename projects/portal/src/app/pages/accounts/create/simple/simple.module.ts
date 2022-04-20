import { SimpleRoutingModule } from './simple-routing.module';
import { SimpleComponent } from './simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewSimpleModule } from 'projects/portal/src/app/views/accounts/create/simple/simple.module';

@NgModule({
  declarations: [SimpleComponent],
  imports: [CommonModule, SimpleRoutingModule, ViewSimpleModule],
})
export class SimpleModule {}
