import { MaterialModule } from '../material.module';
import { ProposalsComponent } from './proposals.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProposalsComponent],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  exports: [ProposalsComponent],
})
export class ProposalsModule {}
