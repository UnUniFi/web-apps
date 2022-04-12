import { MaterialModule } from '../material.module';
import { VoteComponent } from './vote.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VoteComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [VoteComponent],
})
export class VoteModule {}
