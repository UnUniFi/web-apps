import { AddressComponent } from './address.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [AddressComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [AddressComponent],
})
export class AddressModule {}
