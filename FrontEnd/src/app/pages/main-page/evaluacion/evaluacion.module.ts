import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluacionComponent } from './evaluacion.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EvaluacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: EvaluacionComponent }
    ])
  ]
})
export class EvaluacionModule { }
