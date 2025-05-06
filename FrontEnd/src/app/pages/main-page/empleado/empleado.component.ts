import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { Iempleado } from 'src/app/interface/iempleado';
import { Igenerica } from 'src/app/interface/igenerica';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { subscribeOn } from 'rxjs';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/services/empresa.service';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
})
export class EmpleadoComponent implements OnInit {
  //Creamos grupo de controles
  //variable que valida el envio del formulario
  formSubmitted = false;
  public  NombresApellidos:string="";
  public  Rucedula:string="";
  public  Sueldo:number=0;
  public  Ingreso:string="";
  public  Clase:string="";
  public  Direccion:string="";
  public  Telefono:string="";
  public  Regimen:string="";
  public  Estado:number=1;
  public  Perfiles:number=1;
  public  TipoSocio:number=1;
  public  Correo:string="";
  public  Rol:string="";
  public  FondoReserva:string="";
  public empresa: any = [];
  /* variable global que tipifica la interfaz de empleado */
  public empleado: any = [];
  public comboperfil: any = [];
  public combotipoSocio: any = [];

  public Resul:any=[];
  @ViewChild('myInput') myInputVariable: any;

  public generica: any = [];
  public cargaInicial: any = [];
  public verempleado: any = [];
  public titulo: string = '';
  idValor: number = 0;
  /** Variable para ver lista o ingreso de empleados */
  registroEm = false;
  verLista = true;
  OcultarEmpresa = true;
  loading = false;
  /**Paginacion */
  p: number = 1;
  /** ordenar */
  orderHeader: String = '';
  isDescOrder: boolean = true;
  /** filter */
  filterText: any = { nombresApellidos: '' };

  public strPerfil:string="";
  public tipo:number = 0;
  public IdEmpresa: number = 0;

  archivo = {
    IdRutaDoc:0,
    IdContrato:0,
    IdForeCast:0,
    NombreArchivo: null,
    base64textString: "",
    TipoDocumento:"",
    Estado:1,
    Tipo:1
  }

  constructor(
    private form: FormBuilder,
    private empleadoService: EmpleadoService,
    private empresaService: EmpresaService,
    private router: Router,
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
          this.OcultarEmpresa=false;
        }
    }

    this.titulo = 'Lista de Empleados';
    this.getDataEmpresa(this.IdEmpresa, this.tipo);
    this.getData(this.IdEmpresa,this.tipo);
    this.getDataPerfil(this.strPerfil);
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

  sort(headerName: String) {
    this.orderHeader = headerName; //
  }

  getData(IdEmpresa:number,tipo:number) {
    this.empleadoService.MostrarEmpleadoId(IdEmpresa,tipo).subscribe(
      (resp: any) => {
        this.empleado = resp['$values'];
        //console.log('this.empleado:', this.empleado);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  _handleReaderLoaded(readerEvent:any) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }


  seleccionarArchivo(event:any) {
    if(this.idValor!=0){
      var files = event.target.files;
      var file = files[0];
      this.archivo.NombreArchivo = file.name;

      if(files && file) {
        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
    else{
      alerts.basicAlert("Advertencia","Debe primero Selecionar el empleado.","warning");
    }
  }

  getDataPerfil(Descripcion:string) {
    this.empleadoService.MostrarPerfiles(Descripcion).subscribe(
      (resp: any) => {
        this.comboperfil = resp['$values'];
        //console.log('this.perfil:', this.comboperfil);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  IngresarEmpleado() {
    //console.log("Ingreso al boton 1")
    this.titulo = 'Ingresar  Empleados';
    this.registroEm = true;
    this.verLista = false;
    this.formSubmitted = false;
    this.idValor = 0;
    this.InicializarFecha();
  }

  VerEditarEmpleado() {
    //console.log("Ingreso al boton 1")
    this.titulo = 'Ingresar  Empleados';
    this.registroEm = true;
    this.verLista = false;
    this.formSubmitted = false;
    this.idValor = 0;
  }

  ListaEmpleados() {
    //console.log("Ingreso al boton 2")
    this.titulo = 'Lista de Empleados/Socios';
    this.registroEm = false;
    this.verLista = true;
    this.LImpiarInput();
    this.formSubmitted = false;
    this.idValor = 0;
  }

  LImpiarInput() {
      this.NombresApellidos = '';
      this.Rucedula = '';
      this.Sueldo = 0;
      this.Ingreso = '';
      this.Clase = '';
      this.Direccion = '';
      this.Telefono = '';
      this.Regimen = '';
      this.Correo = '';
      this.Estado = 0;
      this.Perfiles = 0;

  }

  GuardarEmpleado() {
    console.log("idValor: ",this.idValor);
    if (this.idValor == 0) {
      this.formSubmitted = false;
     /* if (this.createEmpleado.invalid) {
        return;
      }*/
      const data: Iempleado = {
        IdEmpleado: 0,
        IdEmpresa:this.IdEmpresa,
        IdPerfil: this.Perfiles,
        NombresApellidos:this.NombresApellidos,
        Rucedula: this.Rucedula,
        Sueldo: this.Sueldo,
        Ingreso: this.Ingreso,
        Clase: this.Clase,
        Direccion: this.Direccion,
        Telefono: this.Telefono,
        Regimen: this.Regimen,
        Correo: this.Correo,
        Rol:this.Rol,
        FondoReserva:this.FondoReserva,
        Estado: 1,
        Tipo: 1,
        act_password: true,
        contrasenia: 'gacampuz2016',
      };
      this.loading = true;
      this.empleadoService.GuardarEmpleado(data).subscribe(
        (resp: any) => {
          // console.log("resp",resp['$values']);
          this.cargaInicial = resp['$values'];
          //console.log("this.cargaInicial",this.cargaInicial);
          this.generica = this.cargaInicial[0];
          //console.log("this.generica",this.generica);
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          //console.log("valor1",valor1);
          //console.log("valor2",valor2);

          //guardar un nuevo empleado
          if (valor1 == 1) {
            alerts.basicAlert('Excelente', valor2, 'success');
              this.NombresApellidos = '';
              this.Rucedula = '';
              this.Sueldo = 0;
              this.Ingreso = '';
              this.Clase = '';
              this.Direccion = '';
              this.Telefono = '';
              this.Regimen = '';
              this.Correo = '';
              this.Perfiles = 1;
              this.TipoSocio=1;
              this.Estado = 1;
              this.Rol = '';
              this.FondoReserva = '';

            this.formSubmitted = false;
            this.registroEm = false;
            this.verLista = true;
            this.loading = false;
            this.getData(this.IdEmpresa,this.tipo);
          }
          //actualizar un empleado
          else if (valor1 == 2) {
            this.loading = false;
            alerts.basicAlert('Excelente', valor2, 'success');
          }
          //existe el empleado
          else if (valor1 == 4) {
            this.loading = false;
            alerts.basicAlert('Advertencia', valor2, 'warning');
          }
        },
        (err) => {
          console.log('err', err);
          this.loading = false;
        }
      );
    } else {
      //console.log("Editar:",this.idValor);
      this.formSubmitted = true;
      //console.log(this.createEmpleado);
      const data: Iempleado = {
        IdEmpleado: this.idValor,
        IdEmpresa:this.IdEmpresa,
        IdPerfil: this.Perfiles,
        NombresApellidos:this.NombresApellidos,
        Rucedula: this.Rucedula,
        Sueldo: this.Sueldo,
        Ingreso: this.Ingreso,
        Clase: this.Clase,
        Direccion: this.Direccion,
        Telefono: this.Telefono,
        Regimen: this.Regimen,
        Correo: this.Correo,
        Rol:this.Rol,
        FondoReserva:this.FondoReserva,
        Estado: 1,
        Tipo: 2,
        act_password: true,
        contrasenia: 'gacampuz2016',
      };
      this.loading = true;
      this.empleadoService.GuardarEmpleado(data).subscribe(
        (resp: any) => {
          // console.log("resp",resp['$values']);
          this.cargaInicial = resp['$values'];
          //console.log("this.cargaInicial",this.cargaInicial);
          this.generica = this.cargaInicial[0];
          //console.log("this.generica",this.generica);
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          //console.log("valor1",valor1);
          //console.log("valor2",valor2);

          //actualizar un empleado
          if (valor1 == 2) {
            this.loading = false;
            alerts.basicAlert('Excelente', valor2, 'success');
            this.NombresApellidos = '';
            this.Rucedula = '';
            this.Sueldo = 0;
            this.Ingreso = '';
            this.Clase = '';
            this.Direccion = '';
            this.Telefono = '';
            this.Regimen = '';
            this.Correo = '';
            this.Perfiles = 1;
            this.Estado = 1;
            this.TipoSocio=1;
            this.Rol = '';
            this.FondoReserva = '';

            this.formSubmitted = false;
            this.registroEm = false;
            this.verLista = true;
            this.loading = false;
            this.getData(this.IdEmpresa,this.tipo);
          }
        },
        (err) => {
          console.log('err', err);
          this.loading = false;
        }
      );
    }
  }

  EditarEmpleado(data: any) {
    //console.log('data: ', data);
    let newDate = new Date(data.ingreso);
    this.NombresApellidos = data.nombresApellidos;
    this.Rucedula = data.rucedula;
    this.Sueldo = data.sueldo;
    this.Ingreso = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2);
    this.Clase = data.clase;
    this.Direccion = data.direccion;
    this.Telefono = data.telefono;
    this.Regimen = data.regimen;
    this.Correo = data.correo;
    this.Estado = data.estado;
    this.Perfiles = data.idPerfil;
    this.TipoSocio =data.idTipoSocio;
    this.Rol = data.rol;
    this.FondoReserva = data.fondoReserva;
    this.IdEmpresa =data.idEmpresa;
    this.titulo = 'Editar de Empleado';
    this.idValor = data.idEmpleado;
    this.registroEm = true;
    this.verLista = false;

  }

  EliminarEmpleado(id: number) {
    //console.log('eliminar: ', id);

    const data: Iempleado = {
      IdEmpleado: id,
      IdEmpresa:this.IdEmpresa,
      IdPerfil: 2,
      NombresApellidos: '',
      Rucedula: '',
      Sueldo: 0,
      Ingreso: '',
      Clase: '',
      Direccion: '',
      Telefono: '',
      Regimen: '',
      Correo: '',
      Rol:'',
      FondoReserva:'',
      Estado: 0,
      Tipo: 3,
      act_password: true,
      contrasenia: 'gacampuz2016',
    };
    this.empleadoService.GuardarEmpleado(data).subscribe(
      (resp: any) => {
        this.cargaInicial = resp['$values'];
        //console.log("this.cargaInicial",this.cargaInicial);
        this.generica = this.cargaInicial[0];
        //console.log("this.generica",this.generica);
        let valor1;
        let valor2;
        valor1 = this.generica.valor1;
        valor2 = this.generica.valor2;
        //console.log("valor1",valor1);
        //console.log("valor2",valor2);

        //desactivar un empleado
        if (valor1 == 3) {
          this.loading = false;
          this.getData(this.IdEmpresa,this.tipo);
          alerts.basicAlert('Excelente', valor2, 'success');
        }
      },
      (err) => {}
    );
  }

  VerEmpleado(id: number) {
    //console.log("ver: ",id);
    this.empleadoService.MostrarEmpleadoId(id, 1).subscribe(
      (resp: any) => {
        //this.empleado=resp['$values'];
        //console.log("this.empleado:",resp['$values']);
        this.cargaInicial = resp['$values'];
        //console.log("this.cargaInicial",this.cargaInicial);
        this.verempleado = this.cargaInicial[0];
        //console.log("this.verempleado",this.verempleado);
        let newDate = new Date(this.verempleado.ingreso);

          this.NombresApellidos = this.verempleado.nombresApellidos;
          this.Rucedula = this.verempleado.rucedula;
          this.Sueldo = this.verempleado.sueldo;
          this.Ingreso = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2);
          this.Clase = this.verempleado.clase;
          this.Direccion = this.verempleado.direccion;
          this.Telefono = this.verempleado.telefono;
          this.Regimen = this.verempleado.regimen;
          this.Correo = this.verempleado.correo;
          this.Rol = this.verempleado.rol;
          this.FondoReserva = this.verempleado.fondoReserva;

        this.formSubmitted = false;
        this.IngresarEmpleado();
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  invalidField(field: string) {
    return functions.invalidField2(
      field,
      this.formSubmitted
    );
  }

  InicializarFecha() {
    var today = new Date();
    this.Ingreso=
      today.getFullYear() +
        '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + today.getDate()).slice(-2)
    ;
  }
}
