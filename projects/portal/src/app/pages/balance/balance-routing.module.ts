import { BalanceComponent } from './balance.component';
import { SendComponent } from './send/send.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BalanceComponent },
  { path: 'bank/send', component: SendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceRoutingModule {}
