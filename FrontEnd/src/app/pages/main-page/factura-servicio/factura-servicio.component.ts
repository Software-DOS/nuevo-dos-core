import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';

import { MatDialog } from '@angular/material/dialog';

import { ClienteServicioService } from 'src/app/services/cliente-servicio.service';

import { ModelClienteComponent } from './model-cliente/model-cliente.component';
import { TributarioService } from 'src/app/services/tributario.service';
import { ContratoService } from 'src/app/services/contrato.service';

@Component({
  selector: 'app-factura-servicio',
  templateUrl: './factura-servicio.component.html',
  styleUrls: ['./factura-servicio.component.css']
})
export class FacturaServicioComponent implements OnInit {

  UserForm! : FormGroup;
  UserForm2! : FormGroup;
  UserForm3! : FormGroup;

//variable que valida el envio del formulario
formSubmitted=false;
public titulo:string="";
verFactura=false;
verLista = true;
Ocultar=true;

public cargaListaCliente:any=[];
public verDetalleCliente:any=[];

//cliente
public identificacion:string="9999999999999";
public razonSocial:string="CONSUMIDOR FINAL";
public direccion:string="Quito-Ecuador";
public telefono:string="9999999999";
public mail:string="sincorreo@hotmail.com";
public secuencial:string="001-001-000000001";
//encabezado total
public totalPagar:string="0.00";
public subtotalSinImpuestos:string="0.00";
public subtotalIva:string="0.00";
public subtotal0:string="0.00";
public subtotalNoIva:string="0.00";
public totalDescuento:string="0.00";
public iva:string="0.00";
public ice:string="0.00";
public valortotal:string="0.00";
public formaPago:string="0.00";
public SecuencialDoc: any = [];
public generica3: any = [];
public IdClienteServicio:number=0;

//detalle factura
listData:any;
listDataServicio:any;
listDataFinal: any;
ngDropdown = 1;
ngDropdown1=12;

public json: string = '';
public jsonFinal: string = '';
public comboProceso: any = [];
public generica: any = [];

  constructor(
    public dialog: MatDialog,
    private fb:FormBuilder,
    private clienteServicioService: ClienteServicioService,
    private contratoService: ContratoService,
    private tributarioService: TributarioService,
  )
  {
    this.UserForm= this.fb.group({
      FechaDesde:[''],
      FechaHasta:[''],
      FechaEmision:[''],
      cboTipoPago:[''],
      Cantidad:[''],
      Detalle:[''],
      Precio:[''],
      Descuento:[''],
      Total:[''],
      Iva:[''],
    })


    this.listData=[];
    this.listDataServicio=[];
    this.listDataFinal=[];
   }

  ngOnInit(): void {
    this.titulo="Lista de Factura";
    this. InicializarFecha();
    this.generarSecuencia("FACTURA");
  }

  borrarControles(){
    //cliente
this.identificacion ="9999999999999";
this.razonSocial ="CONSUMIDOR FINAL";
this.direccion ="Quito-Ecuador";
this.telefono ="9999999999";
this.mail ="sincorreo@hotmail.com";

//encabezado total
this.totalPagar ="0.00";
this.subtotalSinImpuestos ="0.00";
this.subtotalIva ="0.00";
this.subtotal0 ="0.00";
this.subtotalNoIva ="0.00";
this.totalDescuento ="0.00";
this.iva ="0.00";
this.ice ="0.00";
this.valortotal ="0.00";
this.formaPago ="0.00";
  }

  generarSecuencia(nombre: string) {
    this.tributarioService.MostrarSecuencial(nombre, 0).subscribe(
      (resp: any) => {
        this.SecuencialDoc = resp['$values'];
        this.generica3 = this.SecuencialDoc[0];
        this.secuencial =
          this.generica3.puntoEmision +
          '-' +
          this.generica3.establecimiento +
          '-' +
          this.generica3.strSecuencial;
        //console.log("this.SecuencialDoc:",this.SecuencialDoc);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  InicializarFecha(){
    var today = new Date();
    this.UserForm.controls['FechaDesde'].setValue(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
    this.UserForm.controls['FechaHasta'].setValue(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
    this.UserForm.controls['FechaEmision'].setValue(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
  }

  MostrarReporte(){
    console.log("FechaDesde: ", this.UserForm.controls['FechaDesde'].value)
    console.log("FechaHasta: ", this.UserForm.controls['FechaHasta'].value)
  }

  IngresarFactura(){
    this.titulo="Ingreso de Factura";
    this.verLista = false;
    this.verFactura=true;
  }

  ListaFactura(){
    this.titulo="Lista de Factura";
    this.verLista = true;
    this.verFactura=false;
  }

  BuscarCliente(){
    const dialogRef =this.dialog.open(ModelClienteComponent,{
      width: '60vw', //sets width of dialog
      height:'80vh', //sets width of dialog
      maxWidth: '100vw', //overrides default width of dialog
      maxHeight: '100vh', //overrides default height of dialog
      disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to cl
    });
    dialogRef.afterClosed().subscribe(result=>{
      this.IdClienteServicio = Number(result.id);
      this.clienteServicioService.MostrarListaClientes(1,result.id).subscribe(
        (resp:any)=>{
          this.cargaListaCliente = resp['$values'];
          this.verDetalleCliente = this.cargaListaCliente[0];
          this.identificacion = this.verDetalleCliente.ruCedula;
          this.razonSocial = this.verDetalleCliente.descripcion;
          this.direccion = this.verDetalleCliente.direccion;
          this.telefono = this.verDetalleCliente.telefono;
          this.mail = this.verDetalleCliente.email;
          //console.log("this.verDetalleCliente: ",this.verDetalleCliente);
      },
      (err)=>{
        console.log("err:",err);
      }
    );
    });
  }

  AgregarProducto(){

    if(this.UserForm.controls['Descuento'].value==""){
      this.UserForm.controls['Descuento'].setValue("0.00")
    }

    var object = {
      Cantidad : this.UserForm.controls['Cantidad'].value,
      Detalle : this.UserForm.controls['Detalle'].value,
      Precio : this.UserForm.controls['Precio'].value,
      Descuento : this.UserForm.controls['Descuento'].value,
      Total : this.UserForm.controls['Total'].value,
      Iva : this.UserForm.controls['Iva'].value,
    }

    this.listData.push(object);

    var objectServicio ={
      Cantidad : this.UserForm.controls['Cantidad'].value,
      Detalle : this.UserForm.controls['Detalle'].value,
      Precio : this.UserForm.controls['Precio'].value,
      Descuento : this.UserForm.controls['Descuento'].value,
      Iva : this.UserForm.controls['Iva'].value,
      Total : this.UserForm.controls['Total'].value,
    }

    this.listDataServicio.push(object);

    let subtotal12 = 0;
    let subtotal12Final = 0;
    let subtotal0 = 0;
    let subtotal0Final = 0;
    let subtotalFinal = 0;
    let totalDescuento = 0;
    let descuento = 0;
    let iva = 0;
    let total = 0;
    let precio_unitario = 0;
    let cantidad = 0;
    let porcentajeDescuento = 0;

    this.subtotalSinImpuestos="";
    this.iva="";
    this.valortotal="";
    this.formaPago="";
    this.totalPagar="";
    for (var detalle of this.listData){
      if(detalle.Iva == 0){
        subtotal0Final = Number(subtotal0Final) + Number(detalle.Total);
        this.subtotal0="";
        this.subtotal0=subtotal0Final.toFixed(2).toString();
      }
      else if(detalle.Iva == 12){
        subtotal12Final = Number(subtotal12Final) + Number(detalle.Total);
        iva = iva + detalle.Total * (detalle.Iva/100);
        this.subtotalIva="";
        this.subtotalIva=subtotal12Final.toFixed(2).toString();
      }
    }

    subtotalFinal=Number(subtotal0Final)+Number(subtotal12Final);
    this.subtotalSinImpuestos=subtotalFinal.toFixed(2).toString();

    if(iva==0){
      total=Number(subtotal0Final)+Number(subtotal12Final)+Number(iva)
      this.valortotal=total.toFixed(2).toString();
      this.iva="0.00";
    }
    else
    {
      this.iva=iva.toFixed(2).toString();
      total=Number(subtotal0Final)+Number(subtotal12Final)+Number(iva)
      this.valortotal=total.toFixed(2).toString();
    }

    this.formaPago=this.valortotal;
    this.totalPagar=this.valortotal;

    this.UserForm.controls['Cantidad'].setValue(""),
    this.UserForm.controls['Detalle'].setValue(""),
    this.UserForm.controls['Precio'].setValue(""),
    this.UserForm.controls['Descuento'].setValue(""),
    this.UserForm.controls['Total'].setValue(""),


    //this.UserForm.reset();

    this.ngDropdown = 1;
    this.ngDropdown1=12;
    this. InicializarFecha();
  }

  removeItem(element:any){
    this.listData.splice(element, 1);
    this.listDataServicio.splice(element, 1);
    let subtotal12 = 0;
    let subtotal12Final = 0;
    let subtotal0 = 0;
    let subtotal0Final = 0;
    let subtotalFinal = 0;
    let totalDescuento = 0;
    let descuento = 0;
    let iva = 0;
    let total = 0;
    let precio_unitario = 0;
    let cantidad = 0;
    let porcentajeDescuento = 0;

    this.subtotalSinImpuestos="";
    this.iva="";
    this.valortotal="";
    this.formaPago="";
    this.totalPagar="";
    for (var detalle of this.listData){
      if(detalle.Iva == 0){
        subtotal0Final = Number(subtotal0Final) + Number(detalle.Total);
        this.subtotal0="";
        this.subtotal0=subtotal0Final.toFixed(2).toString();
      }
      else if(detalle.Iva == 12){
        subtotal12Final = Number(subtotal12Final) + Number(detalle.Total);
        iva = iva + detalle.Total * (detalle.Iva/100);
        this.subtotalIva="";
        this.subtotalIva=subtotal12Final.toFixed(2).toString();
      }
    }

    subtotalFinal=Number(subtotal0Final)+Number(subtotal12Final);
    this.subtotalSinImpuestos=subtotalFinal.toFixed(2).toString();

    if(iva==0){
      total=Number(subtotal0Final)+Number(subtotal12Final)+Number(iva)
      this.valortotal=total.toFixed(2).toString();
      this.iva="0.00";
    }
    else
    {
      this.iva=iva.toFixed(2).toString();
      total=Number(subtotal0Final)+Number(subtotal12Final)+Number(iva)
      this.valortotal=total.toFixed(2).toString();
    }

    this.formaPago=this.valortotal;
    this.totalPagar=this.valortotal;

    this.UserForm.controls['Cantidad'].setValue(""),
    this.UserForm.controls['Detalle'].setValue(""),
    this.UserForm.controls['Precio'].setValue(""),
    this.UserForm.controls['Descuento'].setValue(""),
    this.UserForm.controls['Total'].setValue(""),


    //this.UserForm.reset();
    this.ngDropdown = 1;
    this.ngDropdown1=12;
    this. InicializarFecha();

 }

 ActualizarCampo(){

  if( (this.UserForm.controls['Descuento'].value == "" ) && (this.UserForm.controls['Cantidad'].value != "" || this.UserForm.controls['Cantidad'].value != 0) && (this.UserForm.controls['Precio'].value != "" || this.UserForm.controls['Precio'].value != 0)  ){
    //console.log("Ingreso 1");
    let cantidad=0;
    let precio=0;
    let total=0;
    let iva=0;
    cantidad = this.UserForm.controls['Cantidad'].value;
    precio = this.UserForm.controls['Precio'].value;
    iva = this.UserForm.controls['Iva'].value;
    total = cantidad*precio;
    this.UserForm.controls['Total'].setValue(total.toFixed(2));
  }

 else if( (this.UserForm.controls['Descuento'].value != "" || this.UserForm.controls['Descuento'].value != 0)  && (this.UserForm.controls['Cantidad'].value != "" || this.UserForm.controls['Cantidad'].value != 0) && (this.UserForm.controls['Precio'].value != "" || this.UserForm.controls['Precio'].value != 0) )
 {
    //console.log("Ingreso 2");
    let cantidad=0;
    let precio=0;
    let total=0;
    let descuento=0;
    let iva=0;
    iva = this.UserForm.controls['Iva'].value;
    cantidad = this.UserForm.controls['Cantidad'].value;
    precio = this.UserForm.controls['Precio'].value;
    descuento = this.UserForm.controls['Descuento'].value;
    total = (cantidad*precio) - (cantidad*precio)*(descuento/100);

    this.UserForm.controls['Total'].setValue(total.toFixed(2));
 }

 }

  GuardarFactura(){

    if(this.listDataServicio.length > 0){


      var object = {
        idContrato: 0,
        IdMedio: 0,
        valorBruto: 0,
        valorNeto: 0,
        valorConex: this.subtotalSinImpuestos,
        NumDocumento: this.secuencial,
        ComisionVendedor: 0,
        ComisionPorcentaje: 0,
        IdClienteServicio:this.IdClienteServicio
      };

      this.listDataFinal.push(object);
      //console.log("this.listDataFinal: ",this.listDataFinal);
      this.json = JSON.stringify(this.listDataServicio);
      //console.log('this.json: ', this.json);
      this.jsonFinal = JSON.stringify(this.listDataFinal);
      //console.log('this.jsonFinal: ', this.jsonFinal);

      this.contratoService
      .GuardarFacturaServicio(
        this.json,
        this.jsonFinal,
        "FACTURA DE SERVICIO",
        this.UserForm.controls['FechaEmision'].value
      )
      .subscribe(
        (resp: any) => {
          this.comboProceso = resp['$values'];
          this.generica = this.comboProceso[0];
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 1) {
            this.InicializarFecha();
            this.listData = null;
            this.listDataFinal = null;
            this.listDataServicio = null;
            this.listDataServicio = [];
            this.listData = [];
            this.listDataFinal = [];
            this.borrarControles();
            this.generarSecuencia('FACTURA');
            alerts.basicAlert('Excelente', valor2, 'success');
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );

    }
    else
    {
      alerts.basicAlert(
        'Advertencia',
        'Debe agregar el detalle de la factura..',
        'warning'
      );
    }

 }

}
