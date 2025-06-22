import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportarCvComponent } from './exportar-cv.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ExportarCvComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ExportarCvComponent }
    ])
  ]
})
export class ExportarCvModule { }
