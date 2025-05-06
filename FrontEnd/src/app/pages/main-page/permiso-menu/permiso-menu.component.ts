import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { EmpleadoService } from 'src/app/services/empleado.service';
//import { ReporteGeneralService } from 'src/app/services/reporte-general.service';
import { PerfilesService } from 'src/app/services/perfiles.service';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

import * as XLSX from 'xlsx';
import { IPermisoMenu } from 'src/app/interface/i-permiso-menu';

@Component({
  selector: 'app-permiso-menu',
  templateUrl: './permiso-menu.component.html',
  styleUrls: ['./permiso-menu.component.css']
})
export class PermisoMenuComponent implements OnInit {

/*Variables ID */
public IdPerfil: number = 0;
public IdTipoReporte: number = 0;
public IdFecha: number = 0;
loading = false;
dropdownSettingsVendedor: IDropdownSettings = {};

/** Variable para ver lista o ingreso de empleados */
verLista = true;

public titulo:string="";
public tipoProceso:number=0;

public comboPerfil: any = [];
public comboTipoReporte: any = [];
public comboFecha: any = [];

public ValidarPago:boolean =false;
public ValidarCheck:boolean =true;

public cargaListaReporte: any = [];
public cargaListaReporteReal: any = [];
public cargaListaReporteArchivo: any = [];

public comboProceso: any = [];
public generica: any = [];
public generica2: any = [];

   /**Paginacion */
   p: number = 1;
   /** ordenar */
   orderHeader: String = '';
   isDescOrder:boolean = true;
   /** filter */
   filterText:any={descripcion:''};

   public IdEmpleado:number=0;
   public descripcionEmpleado: any;
   public empleado: any = [];
   public selectedVendedor1: any;
   public json:string = "";

   public cargaListaPerfil: any = [];

   public strPerfil:string="";
   public IdEmpresa:number = 0;

constructor(
  private empleadoService: EmpleadoService,
  //private reporteGeneralService:ReporteGeneralService,
  private perfilesService: PerfilesService,
) { }


ngOnInit(): void {
  const valor = sessionStorage.getItem('token');
  if (typeof valor === 'string') {
    var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
    //console.log('Empresa: ', IdEmpleado);
    this.strPerfil=IdEmpleado["Perfil"];
    this.IdEmpresa=IdEmpleado["IdEmpresa"];
  }
  this.titulo="Detalle de reporte";
  this.getDataPerfiles(this.strPerfil);
}

getDataPerfiles(Descripcion:string) {
  this.perfilesService.MostrarPrmPerfil(Descripcion).subscribe(
    (resp: any) => {
      this.comboPerfil = resp['$values'];
      //console.log("this.cargaListaPerfil:",this.cargaListaPerfil);
    },
    (err) => {
      console.log('err:', err);
    }
  );
}

getDataEmpleado(IdPerfil:number) {
  this.empleadoService.MostrarDescripcionCombo(5,IdPerfil).subscribe(
    (resp: any) => {
      this.empleado = resp['$values'];
      //console.log('this.empleado:', this.empleado);
    },
    (err) => {
      console.log('err:', err);
    }
  );
}

onItemSelectPerfiles(item: any) {
  this.IdPerfil = item.target.value;
  this.getDataEmpleado(this.IdPerfil);
  this.dropdownSettingsVendedor = {
    singleSelection: true,
    idField: 'idProceso',
    textField: 'descripcion',
    allowSearchFilter: true,
  };
}

onItemSelectTipoReporte(item: any) {
  this.IdTipoReporte = item.target.value;

}

onItemSelectFecha(item: any) {
  this.IdFecha = item.target.value;
}

MostrarReporte(){
  this.getDataReporteGeneral(this.IdEmpleado,0);
}

onItemSelectVendedor(item: any){
  this.IdEmpleado=item.idProceso;
  this.descripcionEmpleado=item.descripcion;
}

handleChange(evt:any) {
  var target = evt.target;
  this.ValidarPago=target.checked;

  if (this.ValidarPago==true) {
    //console.log("this.ValidarPago:",this.ValidarPago);
  }
  else{
    //console.log("this.ValidarPago:",this.ValidarPago);
  }
}

getDataReporteGeneral(IdEmpleado:number,Tipo:number) {
  this.loading = true;
  this.empleadoService.MostrarPermisoMenu(IdEmpleado,Tipo).subscribe(
    (resp: any) => {
      this.cargaListaReporte = resp['$values'];
      this.loading = false;
      //console.log("this.cargaListaReporte:",this.cargaListaReporte);
    },
    (err) => {
      console.log('err:', err);
    }
  );
}

GuardarProceso(){

  //console.log("this.cargaListaReporte: ",this.cargaListaReporte);

  if(this.IdEmpleado!=0)
    {
      this.json = JSON.stringify(this.cargaListaReporte);
      const data: IPermisoMenu = {
        IdEmpleado: this.IdEmpleado,
        Lista: this.json,
        Tipo: 1,
      };
      this.empleadoService.GuardarPermisoMenu(data).subscribe(
        (resp: any) => {
          this.comboProceso = resp['$values'];
          this.generica = this.comboProceso[0];
          //console.log("this.generica: ",this.generica);
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 1) {
            this.MostrarReporte();
            alerts.basicAlert('Excelente', valor2, 'success');
          }
          else  if (valor1 == 4)
          {
            alerts.basicAlert('Excelente', valor2, 'success');
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );
    }
}

sort(headerName:String){
  this.orderHeader=headerName;//
}

}
