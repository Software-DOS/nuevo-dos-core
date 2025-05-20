import { Component, OnInit, ViewChild } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Iempresa } from 'src/app/interface/iempresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { TributarioService } from 'src/app/services/tributario.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
})
export class EmpresaComponent implements OnInit {
  archivoCertificado = {
    NombreArchivo: '',
    ArchivoBase64: '',
  };

  archivoImagen = {
    NombreArchivo: '',
    ArchivoBase64: '',
  };

  //Variable de Ingreso
  public IdEmpresa: number = 0;
  public RazonSocial: string = '';
  public NombreComercial: string = '';
  public Ruc: string = '';
  public NumResolucion: string = '';
  public Direccion: string = '';
  public Correo: string = '';
  public Telefono: string = '';
  public Obligado: string = '';
  public Regimen: string = '';
  public RutaCertificado: string = '';
  public ClaveCertificado: string = '';
  public RutaImagen: string = '';
  public Archivo64Certificado: string = '';
  public Archivo64Imagen: string = '';
  public NumCaracter:number = 0;
  public paciente: any = [];
  public comboProceso: any = [];
  public comboRegimen: any = [];
  public generica: any = [];
  public generica2: any = [];
  public titulo: string = '';
  public Fecha: string = '';
  public tipo:number = 0;

  registroEm = false;
  verLista = true;
  public cargaListaPaciente: any = [];
  //variable que valida el envio del formulario
  public strPerfil:string="";
  formSubmitted = false;
  loading = false;
  /**Paginacion */
  p: number = 1;
  /** ordenar */
  orderHeader: String = '';
  isDescOrder: boolean = true;
  /** filter */
  filterText: any = { descripcion: '' };

  @ViewChild('myInputCertificado') myInputCertificado: any;
  @ViewChild('myInputImgan') myInpuImagen: any;

  constructor(
    private empresaService: EmpresaService,
    private tributarioService: TributarioService,
    ) {}

  ngOnInit(): void {

    const valor = sessionStorage.getItem('token');
    if (typeof valor === 'string') {
      var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
      //console.log('Empresa: ', IdEmpleado);
      this.strPerfil=IdEmpleado["Perfil"];
      this.IdEmpresa=IdEmpleado["IdEmpresa"];
        if(this.strPerfil!="ADMINISTRADOR"){
          this.tipo=1;
        }
    }

    this.titulo = 'Lista de Empresa';
    this.getDataEmpresa(this.IdEmpresa, this.tipo);
    this.getDataRegimen();
    this.InicializarFecha();
  }

  InicializarFecha() {
    var today = new Date();
    this.Fecha =
      today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2);
  }

  LimpiarCajasTexto() {
    this.IdEmpresa = 0;
    this.RazonSocial = '';
    this.NombreComercial = '';
    this.Ruc = '';
    this.NumResolucion = '';
    this.Direccion = '';
    this.Correo = '';
    this.Telefono = '';
    this.Obligado = '';
    this.Regimen = '';
    this.RutaCertificado = '';
    this.ClaveCertificado = '';
    this.RutaImagen = '';
    this.Archivo64Certificado = '';
    this.Archivo64Imagen = '';
  }

  sort(headerName: String) {
    this.orderHeader = headerName; //
  }

  IngresarPaciente() {
    this.titulo = 'Ingreso de Empresa';
    this.formSubmitted = false;
    this.IdEmpresa = 0;
    this.registroEm = true;
    this.verLista = false;
  }

  EditarEmpresa(data: any) {
    //console.log("data",data);
    this.IdEmpresa =data.idEmpresa;
    this.Ruc = data.ruc;
    this.RazonSocial = data.razonSocial;
    this.NombreComercial = data.nombreComercial;
    this.Telefono = data.telefono;
    this.Direccion = data.direccion;
    this.Correo = data.correo;
    this.Regimen = data.regimen;
    this.Obligado = data.obligado;
    this.ClaveCertificado = data.claveCertificado;
    this.NumCaracter =data.recortarDetalle;
    this.titulo = 'Editar de Empresa';
    this.formSubmitted = false;
    this.registroEm = true;
    this.verLista = false;
    let newDate1 = new Date(data.fechaCaducidad);
    this.Fecha =  newDate1.getFullYear() +'-' + ('0' + (newDate1.getMonth() + 1)).slice(-2) +'-' +
    ('0' + newDate1.getDate()).slice(-2);

  }

  invalidField(field: string) {
    return functions.invalidField2(field, this.formSubmitted);
  }

  RegresarLista() {
    this.titulo = 'Lista de Empresa';
    this.registroEm = false;
    this.verLista = true;
    this.formSubmitted = false;
    this.IdEmpresa = 0;
  }

  GuardarEmpresa() {
    if(this.Ruc == "" || this.RazonSocial == ""  ){
     this.formSubmitted=true;
   }
   else{

     this.formSubmitted=false;

   if(this.IdEmpresa == 0){
      var today = new Date();
       const data: Iempresa = {
         IdEmpresa:0,
         RazonSocial:this.RazonSocial,
         NombreComercial:this.NombreComercial,
         Ruc:this.Ruc,
         NumResolucion:this.NumResolucion,
         Direccion:this.Direccion,
         Correo:this.Correo,
         Telefono:this.Telefono,
         Obligado:this.Obligado,
         Regimen:this.Regimen,

         RutaCertificado: this.archivoCertificado.NombreArchivo,
         ClaveCertificado:this.ClaveCertificado,

         RutaImagen:this.archivoImagen.NombreArchivo,
         Archivo64Certificado:this.archivoCertificado.ArchivoBase64,
         Archivo64Imagen:this.archivoImagen.ArchivoBase64,

         FechaCaducidad:this.Fecha,
         RecortarDetalle:this.NumCaracter,
         Estado: 1,
         Tipo: 1,
       };
       this.loading = true;

       this.empresaService.GuardarEmpresa(data).subscribe(
         (resp: any) => {
           this.comboProceso = resp['$values'];
           this.generica = this.comboProceso[0];
           let valor1;
           let valor2;
           valor1 = this.generica.valor1;
           valor2 = this.generica.valor2;
           if (valor1 == 1) {
             this.formSubmitted=false;
             this.LimpiarCajasTexto();
             this.RegresarLista();
             alerts.basicAlert('Excelente', valor2, 'success');
             this.loading = false;
             this.getDataEmpresa(0,0);
             this.myInputCertificado.nativeElement.value = null;
             this.myInpuImagen.nativeElement.value = null;
           }
           else if(valor1 == 2)
           {
             this.formSubmitted=false;
             this.LimpiarCajasTexto();
             this.RegresarLista();
             alerts.basicAlert('Excelente', valor2, 'success');
             this.loading = false;
             this.getDataEmpresa(0,0);
           }
           else  if (valor1 == 4)
           {
             this.formSubmitted=false;
             alerts.basicAlert('Advertencia', valor2, 'warning');
             this.loading = false;
           }
           else  if (valor1 == 3)
           {
             this.formSubmitted=false;
             alerts.basicAlert('Advertencia', valor2, 'warning');
             this.loading = false;
           }
         },
         (err) => {
           console.log('err:', err);
         }
       );

     }
     else{

      var today = new Date();
      const data: Iempresa = {
        IdEmpresa:this.IdEmpresa,
        RazonSocial:this.RazonSocial,
        NombreComercial:this.NombreComercial,
        Ruc:this.Ruc,
        NumResolucion:this.NumResolucion,
        Direccion:this.Direccion,
        Correo:this.Correo,
        Telefono:this.Telefono,
        Obligado:this.Obligado,
        Regimen:this.Regimen,

        RutaCertificado: this.archivoCertificado.NombreArchivo,
        ClaveCertificado:this.ClaveCertificado,

        RutaImagen:this.archivoImagen.NombreArchivo,
        Archivo64Certificado:this.archivoCertificado.ArchivoBase64,
        Archivo64Imagen:this.archivoImagen.ArchivoBase64,

        FechaCaducidad:this.Fecha,
        RecortarDetalle:this.NumCaracter,
        Estado: 1,
        Tipo: 2,
      };
      this.loading = true;

      this.empresaService.GuardarEmpresa(data).subscribe(
        (resp: any) => {
          this.comboProceso = resp['$values'];
          this.generica = this.comboProceso[0];
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 1) {
            this.formSubmitted=false;
            this.LimpiarCajasTexto();
            this.RegresarLista();
            alerts.basicAlert('Excelente', valor2, 'success');
            this.loading = false;
            this.getDataEmpresa(0,0);
            this.myInputCertificado.nativeElement.value = null;
            this.myInpuImagen.nativeElement.value = null;
          }
          else if(valor1 == 2)
          {
            this.formSubmitted=false;
            this.LimpiarCajasTexto();
            this.RegresarLista();
            alerts.basicAlert('Excelente', valor2, 'success');
            this.loading = false;
            this.getDataEmpresa(0,0);
          }
          else  if (valor1 == 4)
          {
            this.formSubmitted=false;
            alerts.basicAlert('Advertencia', valor2, 'warning');
            this.loading = false;
          }
          else  if (valor1 == 3)
          {
            this.formSubmitted=false;
            alerts.basicAlert('Advertencia', valor2, 'warning');
            this.loading = false;
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );

     }
   }
  }

  getDataEmpresa(IdEmpresa: number, Tipo: number) {
    this.empresaService.MostrarEmpresa(IdEmpresa, Tipo).subscribe(
      (resp: any) => {
        this.paciente = resp['$values'];
        //console.log('this.empleado:', this.paciente);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  seleccionarArchivoCert(event: any) {
    var files = event.target.files;
    var file = files[0];
    this.archivoCertificado.NombreArchivo = file.name;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadedCertificado.bind(this);
      reader.readAsBinaryString(file);
    }
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

  _handleReaderLoadedCertificado(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivoCertificado.ArchivoBase64 = btoa(binaryString);
  }
  _handleReaderLoadedImagen(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivoImagen.ArchivoBase64 = btoa(binaryString);
  }

  getDataRegimen() {
    this.tributarioService.MostrarCombo(1, 0).subscribe(
      (resp: any) => {
        this.comboRegimen = resp['$values'];
        //console.log("this.comboFecha:",this.comboFecha);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

}

