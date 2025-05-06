import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 👈 IMPORTANTE

// Componentes
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { CardDashboardComponent } from './components/card-dashboard/card-dashboard.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { FormularioSolicitudComponent } from './components/formulario-solicitud/formulario-solicitud.component';
import { CapRowComponent } from './components/cap-row/cap-row.component';
import { GaugeProgresoComponent } from './components/gauge-progreso/gauge-progreso.component';
import { FiltroSidebarComponent } from './components/filtro-sidebar/filtro-sidebar.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    SideBarComponent,
    CardDashboardComponent,
    TabsComponent,
    FormularioSolicitudComponent,
    CapRowComponent,
    GaugeProgresoComponent,
    FiltroSidebarComponent
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    SideBarComponent,
    CardDashboardComponent,
    FiltroSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule { }
