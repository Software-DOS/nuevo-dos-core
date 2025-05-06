import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { InventarioService } from 'src/app/services/inventario.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TributarioService } from 'src/app/services/tributario.service';
import { ClienteServicioService } from 'src/app/services/cliente-servicio.service';

import { DomSanitizer } from '@angular/platform-browser';
import { Ilistaitem } from 'src/app/interface/ilistaitem';
import { Ipedido } from 'src/app/interface/ipedido';
import { IclienteServicio } from 'src/app/interface/icliente-servicio';
import { Iencabezadofactura } from 'src/app/interface/iencabezadofactura';
import { Iguardarfactura } from 'src/app/interface/guardarfactura';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
  dataItem: Ilistaitem[] = [];
  dataItemPedido: Ilistaitem[] = [];
  /**Paginacion */
  p: number = 1;
  /** ordenar */
  orderHeader: String = '';
  isDescOrder: boolean = true;
  /** filter */
  filterText: any = { cliente: '' };

  loading = false;
  rbNotaventa = true;
  rbFactura = false;
  public StrCliente: string = 'CONSUMIDOR FINAL';
  public StrObservacion: string = '';
  public strNumDocumento: string = '';
  public titulo: string = '';
  public StrClienteFactura: string = '';
  public StrObservacionFactura: string = '';
  public StrRucFactura: string = '';
  public IdTipoIdentificacion: number = 0;
  public DireccionFactura: string = '';
  public EmailFactura: string = '';
  public TelefonoFactura: string = '';

  public StrProducto: string = '';
  public StrDescripcion: string = '';
  public Precio: number = 0;
  public Cantidad: number = 0;
  public IdInventario: number = 0;
  public PorcentajeIva: number = 0;
  public imagePath: any = '';
  public inventario: any = [];
  public ClienteServicio: any = [];
  public pedido: any = [];
  public pedidoImprimir: any = [];
  public pedidoDetalle: any = [];
  public generica: any = [];
  public genericaImprimir: any = [];
  public json: string = '';
  public JsonPedido: string = '';
  public JsonCliente: string = '';
  public JsonEncabezado: string = '';
  public comboProceso: any = [];

  public valortotal: string = '0.00';
  public valortotalFactura: string = '0.00';
  public SubTotalFactura: string = '0.00';
  public ivaFactura: string = '0.00';
  public strTipoDocumento: string = 'NotaVenta';
  public srtImpresion: string = '';
  public inventarioUnico: any = [];
  public genericaInventario: any = [];
  dataArray: any[] = [];
  listData: any;

  isVisible: boolean = false;
  isVisiblePrecio: boolean = false;
  isVisibleCliente: boolean = false;

  public Fecha: string = '';
  public FechaFactura: string = '';
  registroEm = false;
  PagarPedido = false;
  verLista = true;
  public strPedidos: string = '';
  //combo
  public comboTipoIdentificacion: any = [];
  public SecuencialDoc: any = [];
  public generica3: any = [];

  public strPerfil:string="";
  public Idtipo:number = 0;
  public IdEmpresa: number = 0;
  OcultarEmpresa = true;
  public empresa: any = [];

  constructor(
    private inventarioService: InventarioService,
    private pedidoService: PedidoService,
    private tributarioService: TributarioService,
    private clienteServicioService: ClienteServicioService,
    private _sanitizer: DomSanitizer,
    private empresaService: EmpresaService,
    private router: Router
  ) {
    this.listData = [];
    this.dataItem = [];
  }

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

    this.titulo = 'Registro Pedido';
    this.InicializarFecha();
    this.verLista = true;
    this.registroEm = false;
    this.getDataPedido(0,this.IdEmpresa, 0);
    this.getDataTipoIdentificacion();
    this.getDataEmpresa(this.IdEmpresa,0);
    this.IdTipoIdentificacion = 2;
    this.rbNotaventa = true;
    this.strNumDocumento = '000-000-000000000';
  }

  MostrarInventarioEmpresa(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.IdEmpresa = Number(selectedValue);
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

  sort(headerName: String) {
    this.orderHeader = headerName; //
  }

  getDataTipoIdentificacion() {
    this.tributarioService.MostrarCombo(16, 0).subscribe(
      (resp: any) => {
        this.comboTipoIdentificacion = resp['$values'];
        //console.log("this.comboOrdenEnviada:",this.comboOrdenEnviada);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  InicializarFecha() {
    var today = new Date();
    this.Fecha =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);

    this.FechaFactura =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);
  }

  BuscarProductos() {
    if (this.StrProducto == '') {
      //alerts.basicAlert('Advertencia', "Debe ingresar el nombre del producto", 'warning');
      this.isVisible = false;
    } else {
      this.getData(0,this.IdEmpresa, this.StrProducto, 2);
      this.isVisible = true;
    }
  }

  BuscarCliente() {
    if (this.StrClienteFactura == '') {
      //alerts.basicAlert('Advertencia', "Debe ingresar el nombre del producto", 'warning');
      this.isVisibleCliente = false;
    } else {
      this.getDataCliente(0, this.StrClienteFactura, 2);
      this.isVisibleCliente = true;
    }
  }

  BuscarPrecios() {
    this.isVisiblePrecio = true;
  }

  getData(IdInventario: number,IdEmpresa: number, Descripcion: string, Tipo: number) {
    this.inventarioService
      .MostrarInventario(IdInventario,IdEmpresa, Descripcion, Tipo)
      .subscribe(
        (resp: any) => {
          this.inventario = resp['$values'];
        },
        (err) => {
          console.log('err:', err);
        }
      );
  }

  getDataCliente(IdClienteServicio: number, Busquedad: string, Tipo: number) {
    this.clienteServicioService
      .MostrarClienteServicioLike(IdClienteServicio, Busquedad, Tipo)
      .subscribe(
        (resp: any) => {
          this.ClienteServicio = resp['$values'];
        },
        (err) => {
          console.log('err:', err);
        }
      );
  }

  SeleccionarProducto(idInventario:number, descripcion: string) {
    this.StrDescripcion = descripcion;
    this.StrProducto = descripcion;
    this.getDataId(idInventario,this.IdEmpresa, 1);
    this.isVisible = false;
  }

  SeleccionarPrecio(IdPrecio: number, Precio: number) {
    this.isVisiblePrecio = false;
    this.Precio = Precio;
  }

  SeleccionarCliente(data: any) {
    //console.log("data:",data);
    this.StrClienteFactura = data.descripcion;
    this.StrRucFactura = data.ruCedula;
    this.DireccionFactura = data.direccion;
    this.EmailFactura = data.email;
    this.isVisibleCliente = false;
  }

  getDataId(IdInventario:number,IdEmpresa:number, Tipo: number) {
    this.loading = true;
    this.inventarioService.MostrarInventario(IdInventario,IdEmpresa, '', Tipo).subscribe(
      (resp: any) => {
        this.inventarioUnico = resp['$values'];
        //console.log("this.inventarioUnico: ",this.inventarioUnico);
        this.genericaInventario = this.inventarioUnico[0];
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + this.genericaInventario.imagen
        );
        this.Precio = this.genericaInventario.precioPublico;
        this.PorcentajeIva = this.genericaInventario.iva;
        this.IdInventario = this.genericaInventario.idInventario;
        this.srtImpresion = this.genericaInventario.impresion;
        //console.log("this.genericaInventario: ",this.genericaInventario);
        if (this.genericaInventario.listaPrecios != '') {
          this.dataArray = JSON.parse(this.genericaInventario.listaPrecios);
        }
        this.loading = false;
        //console.log("this.dataArray ",this.dataArray);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  AgregarPedido() {
    if (this.Cantidad == 0) {
      this.Cantidad = 1;
    }

    const dataLista: Ilistaitem = {
      IdInventario: this.IdInventario,
      Cantidad: this.Cantidad,
      Detalle: this.StrDescripcion,
      Precio: Number((this.Precio / (this.PorcentajeIva / 100 + 1)).toFixed(2)),
      Iva: Number(
        (
          (this.Precio / (this.PorcentajeIva / 100 + 1)) *
          (this.PorcentajeIva / 100)
        ).toFixed(2)
      ),
      Total: Number(
        (
          (this.Precio / (this.PorcentajeIva / 100 + 1) +
            (this.Precio / (this.PorcentajeIva / 100 + 1)) *
              (this.PorcentajeIva / 100)) *
          this.Cantidad
        ).toFixed(2)
      ),
      Impresion: this.srtImpresion,
    };

    this.dataItem.push(dataLista);
    let total = 0;
    for (var detalle of this.dataItem) {
      total = Number(total) + Number(detalle.Total);
    }

    this.valortotal = total.toFixed(2).toString();
    this.StrProducto = '';
    this.Cantidad = 0;
    this.Precio = 0;
    this.StrCliente="CONSUMIDOR FINAL";
  }

  AgregarCliente() {
    this.StrClienteFactura = 'CONSUMIDOR FINAL';
  }

  removeItem(element: any) {
    this.dataItem.splice(element, 1);
  }

  onInputChangeCantidad(event: any, item: Ilistaitem) {
    //console.log("event:", event.target.value);
    if (event.target.value == '') {
      event.target.value = '1';
    }
    //console.log("item1:", item);
    //console.log("tem.Precio:", item.Precio);
    //console.log("tem.Iva:", item.Iva);
    item.Total = 0;
    item.Cantidad = 0;
    item.Cantidad = event.target.value;
    item.Total = Number(
      ((item.Precio + item.Iva) * event.target.value).toFixed(2)
    );
    //console.log("item2:", item);

    let total = 0;
    for (var detalle of this.dataItem) {
      total = Number(total) + Number(detalle.Total);
    }

    this.valortotal = total.toFixed(2).toString();
  }

  onInputChangeDetalle(event: any, item: Ilistaitem) {
    item.Detalle = event.target.value;
  }

  onInputrb(event: any, tipo: string) {
    //console.log("tipo:", tipo);
    //console.log("event:", event.target.checked);
    if ((event.target.checked = true && tipo == 'Factura')) {
      this.rbNotaventa = false;
      this.generarSecuencia('FACTURA');
      this.strTipoDocumento = 'Factura';
    } else if ((event.target.checked = true && tipo == 'NotaVenta')) {
      this.rbFactura = false;
      this.strNumDocumento = '000-000-000000000';
      this.strTipoDocumento = 'NotaVenta';
      this.StrRucFactura = '9999999999999';
      this.DireccionFactura = 'no tiene';
      this.EmailFactura = 'notiene@com.ec';
    }
  }

  limpiarTexto() {
    this.StrCliente = '';
    this.StrDescripcion = '';
    this.imagePath = '';
    this.dataItem = [];
    this.valortotal = '0.00';
    this.verLista = true;
    this.registroEm = false;
    this.StrObservacion = '';
  }

  limpiarTextoFactura() {
    this.StrRucFactura = '';
    this.DireccionFactura = '';
    this.EmailFactura = '';
    this.imagePath = '';
    this.dataItemPedido = [];
    this.pedidoDetalle = [];
    this.valortotalFactura = '0.00';
    this.SubTotalFactura = '0.00';
    this.ivaFactura = '0.00';
    this.verLista = true;
    this.registroEm = false;
    this.PagarPedido = false;
    this.rbFactura = false;
    this.rbNotaventa = true;
    this.strNumDocumento = '000-000-000000000';
  }

  GuardarPedido() {
    if (this.StrCliente == '') {
      alerts.basicAlert(
        'Advertencia',
        'Debe agregar el nombre del cliente',
        'warning'
      );
    } else {
      if (this.dataItem.length > 0) {
        //Guardar Pedido
        this.json = JSON.stringify(this.dataItem);
        //console.log("this.json:", this.json);

        const data: Ipedido = {
          IdPedido: 0,
          IdEmpresa:this.IdEmpresa,
          Cliente: this.StrCliente,
          Observacion: this.StrObservacion,
          FechaRegistro: this.Fecha,
          Estado: 1,
          Json: this.json,
          Tipo: 1,
        };
        this.loading = true;
        this.pedidoService.GuardarPedido(data).subscribe(
          (resp: any) => {
            this.comboProceso = resp['$values'];
            this.generica = this.comboProceso[0];
            let valor1;
            let valor2;
            let valor4;
            valor1 = this.generica.valor1;
            valor2 = this.generica.valor2;
            valor4 = this.generica.valor4;
            if (valor1 == 1) {
              console.log("this.generica",this.generica);
              this.limpiarTexto();
              this.DescargarArchivo(this.generica);
              if (valor4 != '') {
                this.DescargarArchivoDos(this.generica);
              }
              this.getDataPedido(0,this.IdEmpresa, 0);
              this.loading = false;
              alerts.basicAlert('Excelente', valor2, 'success');
            } else if (valor1 == 2) {
              this.loading = false;
              alerts.basicAlert('Advertencia', valor2, 'warning');
            } else if (valor1 == 4) {
              this.loading = false;
              alerts.basicAlert('Advertencia', valor2, 'warning');
            } else if (valor1 == 5) {
              this.loading = false;
              alerts.basicAlert('Advertencia', valor2, 'warning');
            }
          },
          (err) => {
            console.log('err:', err);
            this.loading = false;
          }
        );
      } else {
        alerts.basicAlert('Advertencia', 'Debe agregar el pedido', 'warning');
      }
    }
  }

  GuardarFactura() {
    const dataEncabezadpFac: Iencabezadofactura = {
      TipoDocumento: this.strTipoDocumento,
      NumDocumento: this.strNumDocumento,
      Observacion:this.StrObservacionFactura,
      FechaEmision: this.FechaFactura,
      SubTotal: Number(this.SubTotalFactura),
      Iva: Number(this.ivaFactura),
      Total: Number(this.valortotalFactura),
    };

    const dataCliente: IclienteServicio = {
      IdClienteServicio: 0,
      IdTipoIdentificacion: this.IdTipoIdentificacion,
      RuCedula: this.StrRucFactura,
      Descripcion: this.StrClienteFactura,
      Direccion: this.DireccionFactura,
      Email: this.EmailFactura,
      Telefono: '',
      Tipo: 1,
      Estado: 1,
    };

    this.JsonPedido = JSON.stringify(this.pedidoDetalle);
    //console.log("JsonPedido", this.JsonPedido);
    this.JsonCliente = JSON.stringify(dataCliente);
    //console.log("JsonCliente", "[" + this.JsonCliente + "]");
    this.JsonEncabezado = JSON.stringify(dataEncabezadpFac);
    //console.log("JsonEncabezado", "[" + this.JsonEncabezado + "]");
    //console.log("this.rbFactura:",this.rbFactura)
    //console.log("this.rbNotaventa:",this.rbNotaventa)

    const data: Iguardarfactura = {
      IdEmpresa:this.IdEmpresa,
      JsonPedido: this.JsonPedido,
      JsonCliente: this.JsonCliente,
      JsonEncabezado: this.JsonEncabezado,
      Observacion: this.StrObservacionFactura,
      Estado: 1,
      Tipo: 1,
    };

    this.loading = true;
    this.pedidoService.GuardarFactura(data).subscribe(
      (resp: any) => {
        this.comboProceso = resp['$values'];
        this.generica = this.comboProceso[0];
        let valor1;
        let valor2;
        valor1 = this.generica.valor1;
        valor2 = this.generica.valor2;
        if (valor1 == 1) {
          //console.log("this.generica",this.generica);
          this.limpiarTextoFactura();
          this.DescargarArchivo(this.generica);
          this.getDataPedido(0,this.IdEmpresa, 0);
          this.strPedidos = '';
          this.loading = false;
          this.titulo = 'Registro Pedido';
          alerts.basicAlert('Excelente', valor2, 'success');
        } else if (valor1 == 2) {
          this.loading = false;
          alerts.basicAlert('Advertencia', valor2, 'warning');
        } else if (valor1 == 4) {
          this.loading = false;
          alerts.basicAlert('Advertencia', valor2, 'warning');
        } else if (valor1 == 5) {
          this.loading = false;
          alerts.basicAlert('Advertencia', valor2, 'warning');
        }
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  public b64toBlob(b64Data: any, contentType: any) {
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

  DescargarArchivo(item: any) {
    //console.log("item: ",item);
    var blob = this.b64toBlob(item.valor3, 'application/pdf');
    let a = document.createElement('a');
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = String('Pedido.pdf');
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  DescargarArchivoDos(item: any) {
    //console.log("item: ",item);
    var blob = this.b64toBlob(item.valor4, 'application/pdf');
    let a = document.createElement('a');
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = String('Pedido.pdf');
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  IngresarPedido() {
    this.dataItem = [];
    this.verLista = false;
    this.registroEm = true;
  }

  FacturarPedido(data: any) {}

  RegresarLista() {
    this.verLista = true;
    this.registroEm = false;
    this.PagarPedido = false;
    this.titulo = 'Registro Pedido';
  }

  getDataPedido(IdPedido: number,IdEmpresa:number, Tipo: number) {
    this.pedidoService.MostrarPedido(IdPedido,IdEmpresa, Tipo).subscribe(
      (resp: any) => {
        this.pedido = resp['$values'];
        //console.log('this.pedido:', this.pedido);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  getDataPedidoImprimir(IdPedido: number,IdEmpresa:number, Tipo: number) {
    this.pedidoService.MostrarPedidoImpreso(IdPedido,IdEmpresa, Tipo).subscribe(
      (resp: any) => {
        this.pedidoImprimir = resp['$values'];

        this.genericaImprimir = this.pedidoImprimir[0];
        let valor1;
        let valor2;
        let valor4;
        valor1 = this.genericaImprimir.valor1;
        valor2 = this.genericaImprimir.valor2;
        valor4 = this.genericaImprimir.valor4;
        this.DescargarArchivo(this.genericaImprimir);
        if (valor4 != '') {
          this.DescargarArchivoDos(this.genericaImprimir);
        }
        //console.log('this.pedidoImprimir', this.pedidoImprimir);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  getDataDetallePedido(IdPedido: number, StrPedidios: string, Tipo: number) {
    this.dataItemPedido = [];
    this.pedidoService.MostrarDetallePedido(0,this.IdEmpresa, StrPedidios, Tipo).subscribe(
      (resp: any) => {
        this.pedidoDetalle = [];
        this.pedidoDetalle = resp['$values'];
        //console.log('this.pedidoDetalle:', this.pedidoDetalle);
        this.StrClienteFactura = 'CONSUMIDOR FINAL';
        this.StrRucFactura = '9999999999999';
        this.DireccionFactura = 'no tiene';
        this.EmailFactura = 'notiene@com.ec';
        let total = 0;
        let subtotal = 0;
        let iva = 0;
        for (var detalle of this.pedidoDetalle) {
          subtotal =
            Number(subtotal) + Number(detalle.precio * detalle.cantidad);
          iva =
            Number(iva) +
            Number(detalle.precio * detalle.cantidad) *
              (Number(detalle.porcentaje) / 100);
          total = Number(total) + Number(detalle.total);
          this.StrObservacionFactura = detalle.observacion;
        }

        this.SubTotalFactura = subtotal.toFixed(2).toString();
        this.ivaFactura = iva.toFixed(2).toString();
        this.valortotalFactura = total.toFixed(2).toString();
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  handleChange(evt: any, data: any) {
    var target = evt.target;
    this.StrClienteFactura = data.cliente;
    if (target.checked == true) {
      this.strPedidos = this.strPedidos + data.idPedido + ',';
    } else if (target.checked == false) {
      this.strPedidos = this.strPedidos.replace(data.idPedido + ',', '');
    }
    //console.log("this.strPedidos: ",this.strPedidos);
  }

  Facturar() {
    if (this.strPedidos == null || this.strPedidos == '') {
      alerts.basicAlert('Advertencia', 'Debe seleccionar un pedido', 'warning');
      this.PagarPedido = false;
      this.verLista = true;
    } else {
      this.titulo = 'Registrar Factura / Nota Venta';
      this.getDataDetallePedido(0, this.strPedidos, 1);
      this.PagarPedido = true;
      this.verLista = false;
    }
  }

  generarSecuencia(nombre: string) {
    this.tributarioService.MostrarSecuencial(nombre, 0).subscribe(
      (resp: any) => {
        this.SecuencialDoc = resp['$values'];
        this.generica3 = this.SecuencialDoc[0];
        this.strNumDocumento =
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

  ReimprimirPedido(data: any) {
    //console.log("data: ",data);
    //console.log("data.idPedido",data.idPedido);
    this.getDataPedidoImprimir(data.idPedido,this.IdEmpresa, 0);
  }
}
