import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IclienteServicio } from '../interface/icliente-servicio';

@Injectable({
  providedIn: 'root'
})
export class ClienteServicioService {

  constructor(private http: HttpClient) { }

  GuardarClienteServicio(data:IclienteServicio){

    return this.http.post(environment.urlbackend +"api/ClienteServicio/Guardar",data);

  }

  MostrarListaClientes(Tipo:number,IdClienteServicio :number){
    return this.http.get(environment.urlbackend + "api/ClienteServicio/MostrarClienteServicio?Tipo="+ Tipo +"&IdClienteServicio="+ IdClienteServicio );
  }

  MostrarClienteServicioLike(Tipo:number,Busquedad:string,IdClienteServicio :number){
    return this.http.get(environment.urlbackend + "api/ClienteServicio/MostrarClienteServicioLike?Tipo="+ Tipo +"&Busquedad="+ Busquedad +"&IdClienteServicio="+ IdClienteServicio );
  }



}
