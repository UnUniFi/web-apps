import { DelegateModule } from '../../views/delegate/delegate.module';
import { DelegateRoutingModule } from './delegate-routing.module';
import { DelegateComponent } from './delegate.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DelegateComponent],
  imports: [CommonModule, DelegateRoutingModule, DelegateModule],
})
export class AppDelegateModule {}
