import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCvComponent } from './admin-cv.component'; 

const routes: Routes = [
  { path: '', component: AdminCvComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCvRoutingModule {}


