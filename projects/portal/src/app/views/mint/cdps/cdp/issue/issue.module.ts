import { MaterialModule } from '../../../../material.module';
import { IssueComponent } from './issue.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [IssueComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [IssueComponent],
})
export class IssueModule {}
