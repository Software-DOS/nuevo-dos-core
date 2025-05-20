import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment'; 
import { Icontrato } from '../interface/icontrato';
import { IddetalleContrato } from '../interface/iddetalle-contrato';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(private http: HttpClient) { }

  MostrarForeCastAprobados(IdForeCast:number,IdContrato:number,IdEmpledo:number,Perfil2:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarForeCastAprobadas?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&IdEmpleado="+ IdEmpledo +"&Perfil2="+ Perfil2 +"&Tipo="+ Tipo);
  }

  MostrarContrato(IdForeCast:number,IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarContrato?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&Tipo="+ Tipo);
  }

  MostrarDetalleContrato(IdForeCast:number,IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarDetalleContrato?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&Tipo="+ Tipo);
  }

  MostrarDetalleContratoExcel(IdForeCast:number,IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarDetalleContratoExcel?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&Tipo="+ Tipo);
  }

  MostrarDetallePautaExcel(IdForeCast:number,IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarDetallePautaExcel?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&Tipo="+ Tipo);
  }

  MostrarContratoReporte(IdForeCast:number,IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarContratoReporte?IdForeCast=" + IdForeCast + "&IdContrato="+ IdContrato +"&Tipo="+ Tipo);
  }

  GuardarArchivo(data:any){   
    return this.http.post(environment.urlbackend +"api/Contrato/GuardarArchivo",data);
  }

  GuardarArchivoGeneral(data:any){   
    return this.http.post(environment.urlbackend +"api/Contrato/GuardarArchivoGeneral",data);
  }

  GuardarArchivoRelacion(data:any){   
    return this.http.post(environment.urlbackend +"api/Contrato/GuardarArchivoRelacion",data);
  }

  GuardarArchivoForeCast(data:any){   
    return this.http.post(environment.urlbackend +"api/Contrato/GuardarArchivoForeCast",data);
  }

  GuardarArchivoImagen(data:any){   
    console.log("url: ",environment.urlbackend +"api/Contrato/GuardarArchivoImagen");
    return this.http.post(environment.urlbackend +"api/Contrato/GuardarArchivoImagen",data);
  }

  GuardarContrato(data:Icontrato){
    return this.http.post(environment.urlbackend +"api/Contrato/Guardar",data);
  }

  ActualizarDetalleContrato(data:IddetalleContrato){
    return this.http.post(environment.urlbackend +"api/Contrato/ActualizarDetalleContrato",data);
  }

  MostrarContratoPorFacturar(IdMedio:number,FechaInicio:Date,FechaFinal:Date,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarContratoPorFacturar?IdMedio=" + IdMedio + "&FechaInicio=" + FechaInicio + "&FechaFinal=" + FechaFinal + " &Tipo=" + Tipo + "");
  }

  MostrarFacturaNotaCreditoLista(IdMedio:number,IdContrato:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarFacturaNotaCreditoLista?IdMedio=" + IdMedio + "&IdContrato=" + IdContrato + "&Tipo=" + Tipo + "");
  }

  MostrarFacturaNotaCreditoSeleccionada(IdMedio:number,IdContrato:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarFacturaNotaCreditoSeleccionada?IdMedio=" + IdMedio + "&IdContrato=" + IdContrato + "&Tipo=" + Tipo + "");
  }

  MostrarFacturaPorCobrar(IdContrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarFacturaPorCobrar?IdContrato=" + IdContrato + " &Tipo=" + Tipo + "");
  }

  MostrarCobros(IdPagocontrato:number,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarCobros?IdPagocontrato=" + IdPagocontrato + " &Tipo=" + Tipo + "");
  }


  MostrarFacturaPorCobrarFecha(IdMedios:number,FechaInicio:string,FechaFinal:string,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarFacturaPorCobrarFecha?IdMedio=" + IdMedios + "&FechaInicio=" + FechaInicio + "&FechaFinal=" + FechaFinal + " &Tipo=" + Tipo + "");
  }

  GuardarPagoContrato(JsonDatos:string,JsonDatosFinal:string,Descripcion:string,FechaEmision:string,FechaMesContrato:string){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardarPagoContrato?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal + "  &Descripcion=" + Descripcion + "  &FechaEmision=" + FechaEmision + "  &FechaMesContrato=" + FechaMesContrato + "");
  }

  GuardarNotaDeCredito(JsonDatos:string,JsonDatosFinal:string,Descripcion:string,FechaEmision:string,IdActivar:number){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardarNotaDeCredito?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal + "  &Descripcion=" + Descripcion + "  &FechaEmision=" + FechaEmision + "  &IdActivar=" + IdActivar + "");
  }

  GuardarFacturaServicio(JsonDatos:string,JsonDatosFinal:string,Descripcion:string,FechaEmision:string){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardarFacturaServicio?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal + "  &Descripcion=" + Descripcion + "  &FechaEmision=" + FechaEmision + "");
  }

  GuardarLiquidacion(JsonDatos:string,JsonDatosFinal:string,jsonReembolso:string,jsonAsiento:string,Descripcion:string,FechaEmision:string){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardarLiquidacion?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal +"&jsonReembolso="+ jsonReembolso + "&jsonAsiento="+ jsonAsiento +  "  &Descripcion=" + Descripcion + "  &FechaEmision=" + FechaEmision + "");
  }

  GuardaCobrarContrato(JsonDatos:string,JsonDatosFinal:string,Descripcion:string,TipoTransaccion:String,ValorProceso:number,NumDocumento:String){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardaCobrarContrato?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal + "&Descripcion=" + Descripcion +  "&TipoTransaccion=" + TipoTransaccion + "&ValorProceso=" + ValorProceso +  "  &NumDocumento=" + NumDocumento +  "");
  }

  InsertAsientosContable(JsonDatos:string,JsonDatosFinal:string,JsonValorReal:string,Descripcion:string,TipoTransaccion:String,ValorProceso:number,VariosProceso:string){ 
    return this.http.get(environment.urlbackend +"api/Contrato/InsertAsientosContable?JsonDatos=" + JsonDatos +"&JsonDatosFinal="+ JsonDatosFinal +"&JsonValorReal="+ JsonValorReal + "  &Descripcion=" + Descripcion +  "  &TipoTransaccion=" + TipoTransaccion + "  &ValorProceso=" + ValorProceso + " &VariosProceso=" + VariosProceso + "");
  }

  GuardarDetalleContrato(JsonDatos:string,IdForeCast:number){ 
    return this.http.get(environment.urlbackend +"api/Contrato/GuardarDetalleContrato?JsonDatos=" + JsonDatos +"&IdForeCast="+ IdForeCast);
  }

  MostrarComisionVendedor(IdContrato:number,ValorBruto:number,ValorNeto:number,AnioProceso:Date,Tipo:number){
    return this.http.get(environment.urlbackend + "api/Contrato/MostrarComisionVendedor?IdContrato="+ IdContrato +"&ValorBruto="+ ValorBruto +"&ValorNeto="+ ValorNeto +"&AnioProceso="+ AnioProceso +"&Tipo="+ Tipo +"");
  }


}
