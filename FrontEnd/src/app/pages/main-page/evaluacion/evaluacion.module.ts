import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EvaluacionComponent } from './evaluacion.component';
//modulo
import { EvaluacionRoutingModule } from './evaluacion-routing.module';

@NgModule({
  declarations: [
    EvaluacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EvaluacionRoutingModule
  ]
})
export class EvaluacionModule { }





