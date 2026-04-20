import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JefeEvaluacionComponent } from './jefe-evaluacion.component';
import { RouterModule } from '@angular/router';
import { GthCompetenciaService } from '../../../services/gth-competencia.service';

@NgModule({
  declarations: [
    JefeEvaluacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: JefeEvaluacionComponent }
    ])
  ],
  providers: [
    GthCompetenciaService
  ]
})
export class JefeEvaluacionModule { }
