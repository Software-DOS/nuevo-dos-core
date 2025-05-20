import { NumberFormat } from "xlsx";

export interface Iproveedor {
    IdProveedor:number,
    Nombre:string,
    NombreComercial:string,
    RuCedula:string,
    Direccion:string,
    Telefono:string,
    Email:string,
    CodContable:string,
    AutorizacionSri:string,
    FechaAutorizacion:string,
    FechaCaducidad:string,
    Estado:number,
    Retencion:string,
    Tipo:number    
}
