import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { Ipedido } from '../interface/ipedido';
import { Iguardarfactura } from '../interface/guardarfactura';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) { }

  GuardarPedido(data:Ipedido){
    return this.http.post(environment.urlbackend +"api/Pedido/GuardarPedido",data);
  }

  GuardarFactura(data:Iguardarfactura){
    return this.http.post(environment.urlbackend +"api/Pedido/GuardarFactura",data);
  }

  MostrarPedido(IdPedido:number,IdEmpresa:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Pedido/MostrarPedido?IdPedido=" + IdPedido + "&IdEmpresa=" + IdEmpresa + "&Tipo="+ Tipo);
  }

  MostrarPedidoImpreso(IdPedido:number,IdEmpresa:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Pedido/MostrarPedidoImpreso?IdPedido=" + IdPedido + "&IdEmpresa=" + IdEmpresa + "&Tipo="+ Tipo);
  }

  MostrarFacturaImpreso(IdFactura:number,IdEmpresa:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Pedido/MostrarFacturaImpreso?IdFactura=" + IdFactura +"&IdEmpresa="+ IdEmpresa+"&Tipo="+ Tipo  );
  }

  MostrarDetallePedido(IdPedido:number,IdEmpresa:number,StrPedidos:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Pedido/MostrarDetallePedido?IdPedido=" + IdPedido +"&IdEmpresa="+ IdEmpresa  +"&StrPedidos="+ StrPedidos +"&Tipo="+ Tipo  );
  }

  MostrarFacturas(IdEmpresa:number,FechaInicio:string,FechaFinal:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Pedido/MostrarFacturas?IdEmpresa="+ IdEmpresa  +"&FechaInicio=" + FechaInicio +"&FechaFinal="+ FechaFinal +"&Tipo="+ Tipo  );
  }

}
