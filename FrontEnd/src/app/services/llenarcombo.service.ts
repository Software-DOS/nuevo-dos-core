import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { Illenarcombo } from '../interface/illenarcombo';
import { IclienteAgencia } from '../interface/icliente-agencia';
import { IrelacionMedios } from '../interface/irelacion-medios';
import { IrelacionMedios2 } from '../interface/irelacion-medios2';

@Injectable({
  providedIn: 'root'
})
export class LlenarcomboService {

  constructor(private http: HttpClient) 
  { }

  GuardarAgencia(data:Illenarcombo){  
    return this.http.post(environment.urlbackend +"api/Agencia/Guardar",data);
  }

  GuardarCliente(data:Illenarcombo){
    return this.http.post(environment.urlbackend +"api/Cliente/Guardar",data);
  }

  GuardarMarca(data:Illenarcombo){ 
    return this.http.post(environment.urlbackend +"api/Marca/Guardar",data);
  }

  Modificar(data:IclienteAgencia){ 
    return this.http.post(environment.urlbackend +"api/Agencia/Modificar",data);
  }


  MostrarAgenciaCliente(IdCliente:number,IdAgencia:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Agencia/MostrarClienteAgencia?IdCliente=" + IdCliente + "&IdAgencia="+ IdAgencia +"&Tipo="+ Tipo);
  }

  MostrarCliente(IdCliente:number,IdAgencia:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Cliente/MostrarClienteAgencia?IdCliente=" + IdCliente + "&IdAgencia="+ IdAgencia +"&Tipo="+ Tipo);
  }

  GuardarRelacionMedios(data:IrelacionMedios){  
    return this.http.post(environment.urlbackend +"api/RelacionMedios/Guardar",data);
  }

  GuardarRelacionMedios2(data:IrelacionMedios2){  
    return this.http.post(environment.urlbackend +"api/RelacionMedios/GuardarRelacion",data);
  }

}
