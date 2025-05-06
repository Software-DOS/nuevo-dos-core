import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { Iproveedor } from '../interface/iproveedor';
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(
    private http: HttpClient
  ) { }

  MostrarProveedor(IdProveedor:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Proveedor/MostrarProveedor?IdProveedor="+ IdProveedor +"&Tipo="+ Tipo +"");
  }

  MostrarProveedorArchivoBase64(IdProveedor:number,Tipo:number,TipoDocumento:string){
    return this.http.get(environment.urlbackend + "api/ReporteGeneral/MostrarProveedorArchivoBase64?IdProveedor="+ IdProveedor +"&Tipo="+ Tipo + "&TipoDocumento=" + TipoDocumento +"");
  }

  GuardarProveedor(data:Iproveedor){
    
    return this.http.post(environment.urlbackend +"api/Proveedor/Guardar",data);

  }

}
