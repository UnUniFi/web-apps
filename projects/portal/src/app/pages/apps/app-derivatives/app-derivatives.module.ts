import { AppDerivativesModule } from '../../../views/apps/app-derivatives/app-derivatives.module';
import { AppDerivativesRoutingModule } from './app-derivatives-routing.module';
import { AppDerivativesComponent } from './app-derivatives.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppDerivativesComponent],
  imports: [CommonModule, AppDerivativesRoutingModule, AppDerivativesModule],
})
export class AppAppDerivativesModule {}
