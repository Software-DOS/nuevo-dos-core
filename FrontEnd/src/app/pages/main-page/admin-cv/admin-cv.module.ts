import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCvComponent } from './admin-cv.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AdminCvComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AdminCvComponent }
    ])
  ]
})
export class AdminCvModule { }
