import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TributarioService {

  constructor(private http: HttpClient)
  { }

  MostrarSecuencial(Nombre:string,tipo:number){
    return this.http.get(environment.urlbackend + "api/DocumentoTributario/MostrarSecuencialDoc?Nombre=" + Nombre + "&Tipo=" + tipo +"");
  }

  MostrarCombo(Tipo:number,IdCliente :number){
    return this.http.get(environment.urlbackend + "api/DocumentoTributario/MostrarCombo?Tipo="+ Tipo +"&IdCliente="+ IdCliente );
  }

}
