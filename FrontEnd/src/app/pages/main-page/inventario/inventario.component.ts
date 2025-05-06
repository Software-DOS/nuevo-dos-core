import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { Iinventario } from 'src/app/interface/iinventario';
import { InventarioService } from 'src/app/services/inventario.service';

import { DomSanitizer } from '@angular/platform-browser';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  public cargaListaInventario: any = [];
  public titulo: string = '';
  /* Variables*/
  @ViewChild('myInputImgan') myInpuImagen: any;
  public IdInventario: number = 0;
  public CodigoPrincipal: string = '';
  public CodigoBarra: string = '';
  public Descripcion: string = '';
  public Stock: number = 0;
  public PrecioPublico: number = 0;
  public Costo: number = 0;
  public Servicio: string = 'Bienes';
  public Iva: number = 0;
  public Estado: number = 1;
  public Json: string = '';

  public Impresion:string = '';
  public Detalle: string = '';
  public Precio: number = 0;

  public comboProceso: any = [];
  public generica: any = [];
  loading = false;
  public inventario: any = [];
  public inventarioUnico: any = [];
  public genericaInventario: any = [];
  public empresa: any = [];

  rbPlancha = false;
  rbCocina = false;

  /* Variables*/
  registroEm = false;
  verLista = true;

  /**Paginacion */
  p: number = 1;
  /** ordenar */
  orderHeader: String = '';
  isDescOrder: boolean = true;
  /** filter */
  filterText: any = { descripcion: '' };

  dataArray: any[] = [];

  archivoImagen = {
    NombreArchivo: '',
    ArchivoBase64: '',
  };

  public imagePath:any="";

  listData: any;

  public strPerfil:string="";
  public Idtipo:number = 0;
  public IdEmpresa: number = 0;
  OcultarEmpresa = true;

  constructor(
    private inventarioService: InventarioService,
    private _sanitizer: DomSanitizer,
    private empresaService:EmpresaService,
    ) {
    this.listData = [];
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

    this.getData(0,this.IdEmpresa,0);
    this.getDataEmpresa(this.IdEmpresa,0);
  }

  MostrarInventarioEmpresa(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.IdEmpresa = Number(selectedValue);
    this.getData(0,this.IdEmpresa,0);
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

  getData(IdInventario:number,IdEmpresa:number,Tipo:number) {
    this.inventarioService.MostrarInventario(IdInventario,IdEmpresa,"",Tipo).subscribe(
      (resp: any) => {
        this.inventario = resp['$values'];
        //console.log('this.inventario:', this.inventario);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  getDataId(IdInventario:number,IdEmpresa:number,Tipo:number) {
    this.inventarioService.MostrarInventario(IdInventario,IdEmpresa,"",Tipo).subscribe(
      (resp: any) => {
        this.inventarioUnico = resp['$values'];
        //console.log("this.inventarioUnico: ",this.inventarioUnico);
        this.genericaInventario = this.inventarioUnico[0];
        //console.log("this.genericaInventario: ",this.genericaInventario);
        //Consersion de Json
        this.listData = null;
        this.listData = [];
        //console.log("data.listaPrecios: ",this.genericaInventario.listaPrecios);
        this.dataArray = JSON.parse(this.genericaInventario.listaPrecios);
        //console.log("this.dataArray ",this.dataArray );
        var object;
        for (var detalle of this.dataArray) {
           object = {
            Descripcion: detalle.Descripcion,
            Precio: detalle.Precio,
          };
          this.listData.push(object);
        }
        //console.log("this.listData ",this.listData);
        //Consersion de Json

      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  IngresarInventario() {
    this.verLista = false;
    this.registroEm = true;
  }

  EditarInventario(data: any) {
    //console.log("data.imagen: ",data.imagen);
    this.verLista = false;
    this.registroEm = true;
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ data.imagen);
    this.CodigoPrincipal = data.codigoPrincipal;
    this.CodigoBarra = data.codigoBarra;
    this.Descripcion = data.descripcion;
    this.Stock = data.stock;
    this.PrecioPublico = data.precioPublico;
    this.Costo = data.costo;
    this.Servicio = data.servicio;
    this.Iva = data.iva;
    this.Estado = data.estado;
    this.Impresion= data.impresion;
    this.IdInventario=data.idInventario;

    if(this.Impresion=="COCINA"){
      this.rbCocina=true;
      this.rbPlancha=false;
    }
    else if(this.Impresion=="PLANCHA"){
      this.rbCocina=false;
      this.rbPlancha=true;
    }

    this.getDataId(this.IdInventario,this.IdEmpresa,1);
  }

  sort(headerName: String) {
    this.orderHeader = headerName; //
  }

  RegresarLista() {
    this.verLista = true;
    this.registroEm = false;
  }

  seleccionarArchivoImag(event: any) {
    var files = event.target.files;
    var file = files[0];
    this.archivoImagen.NombreArchivo = file.name;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadedImagen.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoadedImagen(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivoImagen.ArchivoBase64 = btoa(binaryString);
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.archivoImagen.ArchivoBase64);
  }

  AgregarProducto() {
    var object = {
      Descripcion: this.Detalle,
      Precio: this.Precio,
    };
    this.listData.push(object);
    this.Precio = 0;
    this.Detalle = '';
  }

  removeItem(element: any) {
    this.listData.splice(element, 1);
  }

  limpiarTexto() {
    this.Descripcion = '';
    this.CodigoPrincipal="";
    (this.PrecioPublico = 0), (this.Estado = 0);
    this.Servicio = '';
    this.Iva = 0;
    this.Costo = 0;
    this.listData = null;
    this.listData = [];
    this.myInpuImagen.nativeElement.value = null;
    this.Impresion="";
  }

  GuardarInventario() {

    //console.log("this.IdInventario:",this.IdInventario)

    if (this.IdInventario == 0) {
      if (
        this.CodigoPrincipal == "" ||
        this.Descripcion == "" ||
        this.PrecioPublico == 0 ||
        this.Costo == 0 ||
        this.Servicio== ""

      ) {
        alerts.basicAlert('Advertencia', "Debe ingresar todos los parametros..", 'warning');
      } else {
        //Guardar Inventario nuevo
        this.loading = true;
        this.Json = JSON.stringify(this.listData);
        const data: Iinventario = {
          IdInventario: 0,
          IdEmpresa:this.IdEmpresa,
          CodigoPrincipal: this.CodigoPrincipal,
          CodigoBarra: this.CodigoPrincipal,
          Descripcion: this.Descripcion,
          Stock: 0,
          PrecioPublico: this.PrecioPublico,
          Costo: this.Costo,
          Servicio: this.Servicio,
          Iva: this.Iva,
          Imagen: this.archivoImagen.ArchivoBase64,
          Impresion:this.Impresion,
          json: this.Json,
          Estado: this.Estado,
          Tipo: 1,
        };
        this.inventarioService.GuardarInventario(data).subscribe(
          (resp: any) => {
            this.comboProceso = resp['$values'];
            this.generica = this.comboProceso[0];
            let valor1;
            let valor2;
            valor1 = this.generica.valor1;
            valor2 = this.generica.valor2;
            if (valor1 == 1) {
              this.limpiarTexto();
              this.verLista = true;
              this.registroEm = false;
              this.getData(0,this.IdEmpresa,0);
              this.loading = false;
              this.rbCocina=false;
              this.rbPlancha=false;
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
    } else {
      //Actualizar Inventario

      if (
        this.CodigoPrincipal == "" ||
        this.Descripcion == "" ||
        this.PrecioPublico == 0 ||
        this.Costo == 0 ||
        this.Servicio== ""

      ) {
        alerts.basicAlert('Advertencia', "Debe ingresar todos los parametros..", 'warning');
      } else {
        //Guardar Inventario nuevo
        this.loading = true;
        this.Json = JSON.stringify(this.listData);
        const data: Iinventario = {
          IdInventario: this.IdInventario,
          IdEmpresa:this.IdEmpresa,
          CodigoPrincipal: this.CodigoPrincipal,
          CodigoBarra: this.CodigoPrincipal,
          Descripcion: this.Descripcion,
          Stock: this.Stock,
          PrecioPublico: this.PrecioPublico,
          Costo: this.Costo,
          Servicio: this.Servicio,
          Iva: this.Iva,
          Imagen: this.archivoImagen.ArchivoBase64,
          Impresion:this.Impresion,
          json: this.Json,
          Estado: this.Estado,
          Tipo: 2,
        };
        this.inventarioService.GuardarInventario(data).subscribe(
          (resp: any) => {
            this.comboProceso = resp['$values'];
            this.generica = this.comboProceso[0];
            let valor1;
            let valor2;
            valor1 = this.generica.valor1;
            valor2 = this.generica.valor2;
            if (valor1 == 1) {
              this.limpiarTexto();
              this.loading = false;
              alerts.basicAlert('Excelente', valor2, 'success');
            } else if (valor1 == 2) {
              this.loading = false;
              this.verLista = true;
              this.registroEm = false;
              this.getData(0,this.IdEmpresa,0);
              alerts.basicAlert('Excelente', valor2, 'warning');
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

    }

  }

  onInputrb(event: any, tipo: string) {
    if ((event.target.checked = true && tipo == 'PLANCHA')){
      this.rbCocina=false;
      this.Impresion="PLANCHA";
    }
    else if ((event.target.checked = true && tipo == 'COCINA')){
      this.rbPlancha=false;
      this.Impresion="COCINA";
    }
  }

}
