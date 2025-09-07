import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EvaluacionAdminComponent } from './evaluacion-admin.component';
import { RouterModule } from '@angular/router';
import { GthCompetenciaService } from '../../../services/gth-competencia.service';

@NgModule({
  declarations: [
    EvaluacionAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: EvaluacionAdminComponent }
    ])
  ],
  providers: [
    GthCompetenciaService
  ]
})
export class EvaluacionAdminModule { }
