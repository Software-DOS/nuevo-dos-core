import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from './pages/pages-routing.module';

//componentes
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch:'full' }
];
  

@NgModule({
  imports: [RouterModule.forRoot(routes), PagesRoutingModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
