import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluacionAdminComponent } from './evaluacion-admin.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EvaluacionAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: EvaluacionAdminComponent }
    ])
  ]
})
export class EvaluacionAdminModule { }
