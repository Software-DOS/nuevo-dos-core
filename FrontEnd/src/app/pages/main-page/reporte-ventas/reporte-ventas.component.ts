import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { PedidoService } from 'src/app/services/pedido.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css'],
})
export class ReporteVentasComponent implements OnInit {

  public valortotalFactura: string = '0.00';

  public FechaDesde: string = '';
  public FechaHasta: string = '';
  loading = false;
  /** ordenar */
  orderHeader: String = '';
  public descripcion: string = '';
  public generica: any = [];
  public cargaListaFacturas: any = [];
  public pedidoImprimir: any = [];
  public genericaImprimir: any = [];
  public Total:number=0;

  public strPerfil:string="";
  public Idtipo:number = 0;
  public IdEmpresa: number = 0;
  OcultarEmpresa = true;
  public empresa: any = [];

  constructor(
    private pedidoService: PedidoService,
    private empresaService: EmpresaService,
  ) {}

  ngOnInit(): void {

    const valor = sessionStorage.getItem('token');
    if (typeof valor === 'string') {
      var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
      //console.log('Empresa: ', IdEmpleado);
      this.strPerfil=IdEmpleado["Perfil"];
      this.IdEmpresa=IdEmpleado["IdEmpresa"];
      if(this.strPerfil!="ADMINISTRADOR"){
        this.Idtipo=1;
        this.OcultarEmpresa=false;
      }
    }
    this.getDataEmpresa(this.IdEmpresa,0);
    this.InicializarFecha();
  }

  getDataEmpresa(IdEmpresa: number, Tipo: number) {
    this.empresaService.MostrarEmpresa(IdEmpresa, Tipo).subscribe(
      (resp: any) => {
        this.empresa = resp['$values'];
        //console.log('this.empresa:', this.empresa);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  MostrarInventarioEmpresa(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.IdEmpresa = Number(selectedValue);
  }

  InicializarFecha() {
    var today = new Date();
    var today2 = new Date(today.getFullYear(), 0, 1);
    //console.log("today.getMonth(): ",today.getMonth());
    this.FechaDesde =
    today2.getFullYear() +
        '-' +
        ('0' + (today2.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + today2.getDate()).slice(-2)
    ;
    this.FechaHasta =
      today.getFullYear() +
        '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + today.getDate()).slice(-2)
    ;
  }

  MostrarReporte() {
  this.MostrarReporteFacturas(this.FechaDesde,this.FechaHasta,0);
  }

  MostrarReporteFacturas(FechaInicio:string,FechaFinal:string,Tipo:number){
    this.pedidoService.MostrarFacturas(this.IdEmpresa,FechaInicio,FechaFinal,Tipo).subscribe(
      (resp: any) => {
        this.cargaListaFacturas = resp['$values'];

        for (var detalle of this.cargaListaFacturas) {
            this.Total=this.Total+detalle.total;
        }
        this.valortotalFactura = this.Total.toFixed(2).toString();
        if(this.cargaListaFacturas.length == 0){
          alerts.basicAlert("Advertencia","No hay documentos","warning");
        }
         //console.log('this.cargaListaFacturas:', this.cargaListaFacturas);
        //console.log('tamaño :', this.cargaListaPorCobrar.length);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  ReimprimirFactura(data:any){
    this.getDataFacturaImprimir(data.idFactura,this.IdEmpresa,0);
  }

  getDataFacturaImprimir(IdFactura:number,IdEmpresa:number,Tipo:number) {
    this.pedidoService.MostrarFacturaImpreso(IdFactura,IdEmpresa,Tipo).subscribe(
      (resp: any) => {
        this.pedidoImprimir = resp['$values'];
        this.genericaImprimir = this.pedidoImprimir[0];
        this.DescargarArchivo(this.genericaImprimir);
        //console.log('this.pedidoImprimir', this.pedidoImprimir);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  sort(headerName: String) {
    this.orderHeader = headerName; //
  }

  DescargarArchivo(item:any){

    //console.log("item: ",item);
    var blob = this.b64toBlob(item.valor3, "application/pdf");
    let a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = String("Factura.pdf");
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public b64toBlob(b64Data:any, contentType:any) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
