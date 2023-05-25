import { DevelopersModule } from '../../views/developers/developers.module';
import { DevelopersRoutingModule } from './developers-routing.module';
import { DevelopersComponent } from './developers.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DevelopersComponent],
  imports: [CommonModule, DevelopersRoutingModule, DevelopersModule],
})
export class AppDevelopersModule {}
