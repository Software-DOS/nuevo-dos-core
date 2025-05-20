import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imenu } from '../interface/imenu';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Iempleado } from '../interface/iempleado';
import { IPermisoMenu } from '../interface/i-permiso-menu';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http: HttpClient) { }
  /*
    Cargar la data de los todos los empleados.
  */

  MostrarEmpleado(){
    return this.http.get(environment.urlbackend + "api/Empleado/MostrarEmpleados");
  }

  MostrarPerfiles(Descripcion:string){
    return this.http.get(environment.urlbackend + "api/PrmPerfil/MostrarPrmPerfil?Descripcion=" + Descripcion);
  }

  MostrarEmpleadoId(IdEmpresa:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Empleado/MostrarEmpleados?IdEmpresa=" + IdEmpresa +"&Tipo="+ Tipo );
  }

  MostrarPermisoMenu(IdEmpleado:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Empleado/MostrarPermisoMenu?IdEmpleado=" + IdEmpleado +"&Tipo="+ Tipo );
  }

  GuardarEmpleado(data:Iempleado){
    return this.http.post(environment.urlbackend +"api/Empleado/Guardar",data);
  }

  GuardarPermisoMenu(data:IPermisoMenu){
    return this.http.post(environment.urlbackend +"api/Empleado/GuardarPermisoMenu",data);
  }

  MostrarDescripcionCombo(Tipo:number,IdProceso:number){
    return this.http.get(environment.urlbackend + "api/Empleado/MostrarDescripcionCombo?Tipo="+ Tipo +"&IdProceso="+ IdProceso);
  }

}
