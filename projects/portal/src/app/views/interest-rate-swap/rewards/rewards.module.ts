import { RewardsComponent } from './rewards.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RewardsComponent],
  imports: [CommonModule, RouterModule],
  exports: [RewardsComponent],
})
export class RewardsModule {}
