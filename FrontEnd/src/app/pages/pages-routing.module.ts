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
    { path: 'lista-empleados',loadChildren: () => import('./main-page/lista-empleados/lista-empleados.module').then(m=>m.ListaEmpleadosModule) },
    { path: 'lista-capacitaciones',loadChildren: () => import('./main-page/lista-capacitaciones/lista-capacitaciones.module').then(m=>m.ListaCapacitacionesModule) },
    { path: 'lista-evaluaciones',loadChildren: () => import('./main-page/lista-evaluaciones/lista-evaluaciones.module').then(m=>m.ListaEvaluacionesModule) },    { path: 'empleado-cv',loadChildren: () => import('./main-page/empleado-cv/empleado-cv.module').then(m=>m.EmpleadoCvModule) },    { path: 'admin-cv',loadChildren: () => import('./main-page/admin-cv/admin-cv.module').then(m=>m.AdminCvModule) },    { path: 'evaluacion',loadChildren: () => import('./main-page/evaluacion/evaluacion.module').then(m=>m.EvaluacionModule) },    { path: 'lista-aplicantes',loadChildren: () => import('./main-page/lista-aplicantes/lista-aplicantes.module').then(m=>m.ListaAplicantesModule) },    { path: 'empleado-capacitaciones',loadChildren: () => import('./main-page/empleado-capacitaciones/empleado-capacitaciones.module').then(m=>m.EmpleadoCapacitacionesModule) },
    { path: 'exportar-cv',loadChildren: () => import('./main-page/exportar-cv/exportar-cv.module').then(m=>m.ExportarCvModule) },
    { path: 'clima-laboral',loadChildren: () => import('./main-page/clima-laboral/clima-laboral.module').then(m=>m.ClimaLaboralModule) },
    { path: '**', component: Error404Component }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
