import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Iinventario } from '../interface/iinventario';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }

  GuardarInventario(data:Iinventario){
    return this.http.post(environment.urlbackend +"api/Inventario/GuardarInventario",data);
  }

  MostrarInventario(IdInventario:number,IdEmpresa:number,Descripcion:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Inventario/MostrarInventario?IdInventario=" + IdInventario +"&IdEmpresa="+ IdEmpresa  +"&Descripcion="+ Descripcion +"&Tipo="+ Tipo);
  }

  public getJSON(baseURL:string): Observable<any> {
    //return this.http.get(baseURL);
    return this.http.get<any>(baseURL);
  }

}
