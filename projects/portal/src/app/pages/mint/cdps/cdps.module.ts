import { CdpModule } from '../../../views/mint/cdps/cdp/cdp.module';
import { ClearModule } from '../../../views/mint/cdps/cdp/clear/clear.module';
import { DepositModule } from '../../../views/mint/cdps/cdp/deposit/deposit.module';
import { IssueModule } from '../../../views/mint/cdps/cdp/issue/issue.module';
import { WithdrawModule } from '../../../views/mint/cdps/cdp/withdraw/withdraw.module';
import { CdpsModule } from '../../../views/mint/cdps/cdps.module';
import { CreateModule } from '../../../views/mint/cdps/create/create.module';
import { CdpComponent } from './cdp/cdp.component';
import { ClearComponent } from './cdp/clear/clear.component';
import { DepositComponent } from './cdp/deposit/deposit.component';
import { IssueComponent } from './cdp/issue/issue.component';
import { WithdrawComponent } from './cdp/withdraw/withdraw.component';
import { CdpsRoutingModule } from './cdps-routing.module';
import { CdpsComponent } from './cdps.component';
import { CreateComponent } from './create/create.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    CdpsComponent,
    CreateComponent,
    CdpComponent,
    DepositComponent,
    WithdrawComponent,
    IssueComponent,
    ClearComponent,
  ],
  imports: [
    CommonModule,
    CdpsRoutingModule,
    CdpsModule,
    CreateModule,
    CdpModule,
    WithdrawModule,
    DepositModule,
    IssueModule,
    ClearModule,
  ],
})
export class AppCdpsModule {}
