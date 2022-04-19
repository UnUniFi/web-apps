import { MaterialModule } from '../../material.module';
import { ProposalComponent } from './proposal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProposalComponent],
  imports: [CommonModule, RouterModule, MaterialModule, MatChipsModule],
  exports: [ProposalComponent],
})
export class ProposalModule {}
