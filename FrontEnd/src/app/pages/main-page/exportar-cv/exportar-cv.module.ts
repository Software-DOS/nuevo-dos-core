import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportarCvComponent } from './exportar-cv.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ExportarCvComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ExportarCvComponent }
    ])
  ]
})
export class ExportarCvModule { }
