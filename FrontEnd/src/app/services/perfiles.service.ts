import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Iperfil } from '../interface/iperfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(private http: HttpClient) { }

  MostrarPrmPerfil(Descripcion:string) {
    return this.http.get(environment.urlbackend + "api/PrmPerfil/MostrarPrmPerfil?Descripcion=" + Descripcion);
  }


  MostrarPrmPerfilId(IdPerfil:number){
    return this.http.get(environment.urlbackend + "api/PrmPerfil/MostrarPrmPerfilId?IdPerfil=" + IdPerfil);
  }

  GuardarPrmPerfil(data:Iperfil){
    return this.http.post(environment.urlbackend + "api/PrmPerfil/Guardar",data);
  }

}
