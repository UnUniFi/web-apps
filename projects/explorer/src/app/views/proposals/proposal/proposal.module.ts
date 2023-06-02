import { MaterialModule } from '../../material.module';
import { ProposalComponent } from './proposal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [ProposalComponent],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, PipesModule],
  exports: [ProposalComponent],
})
export class ProposalModule {}
