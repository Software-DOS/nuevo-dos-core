import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Iempresa } from '../interface/iempresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  GuardarEmpresa(data:Iempresa){
    return this.http.post(environment.urlbackend +"api/Empresa/Guardar",data);
  }

  MostrarEmpresa(IdEmpresa:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Empresa/MostrarEmpresa?IdEmpresa=" + IdEmpresa + "&Tipo="+ Tipo);
  }

}
