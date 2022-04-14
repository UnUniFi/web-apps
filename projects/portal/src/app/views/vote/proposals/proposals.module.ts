import { MaterialModule } from '../../material.module';
import { ProposalsComponent } from './proposals.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProposalsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [ProposalsComponent],
})
export class VoteModule {}
