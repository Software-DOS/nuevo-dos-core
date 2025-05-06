import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

//componentes
import { MainPageComponent } from './main-page/main-page.component';
import { Error404Component } from './main-page/error404/error404.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(l=>l.LoginModule)},
  { path: '',
  component: MainPageComponent, canActivate:[AuthGuard],
  children: [
    { path: '',loadChildren: () => import('./main-page/home/home.module').then(m=>m.HomeModule) },
    { path: '**', component: Error404Component }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
