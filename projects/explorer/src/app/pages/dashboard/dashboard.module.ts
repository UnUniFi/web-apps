import { BlocksModule } from '../../views/dashboard/blocks/blocks.module';
import { DashboardModule } from '../../views/dashboard/dashboard.module';
import { ValidatorsModule } from '../../views/dashboard/validators/validators.module';
import { BlocksComponent } from './blocks/blocks.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ValidatorsComponent } from './validators/validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DashboardComponent, BlocksComponent, ValidatorsComponent],
  imports: [CommonModule, DashboardRoutingModule, DashboardModule, BlocksModule, ValidatorsModule],
})
export class AppDashboardModule {}
