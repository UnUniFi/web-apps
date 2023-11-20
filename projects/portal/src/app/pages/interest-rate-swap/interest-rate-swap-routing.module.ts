import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { VaultsComponent } from './vaults/vaults.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InterestRateSwapComponent,
  },
  {
    path: 'vaults',
    component: VaultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestRateSwapRoutingModule {}
