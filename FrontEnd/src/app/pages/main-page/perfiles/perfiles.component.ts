import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { PerfilesService } from 'src/app/services/perfiles.service';
import { Iperfil } from 'src/app/interface/iperfil';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  public cargaListaPerfil: any = [];
  public titulo:string="";
  public IdPerfil:number=0;

  public medioId:any=[];
  public comboProceso: any = [];
  public generica: any = [];
  public generica2: any = [];
  /** Variable para ver lista o ingreso de medios */
  registroEm = false;
  verLista = true;

  UserForm!: FormGroup;
  //variable que valida el envio del formulario
  formSubmitted = false;

  /**Paginacion */
  p: number = 1;
  /** ordenar */
  orderHeader: String = '';
  isDescOrder:boolean = true;
  /** filter */
  filterText:any={descripcion:''};

  public strPerfil:string="";
  public IdEmpresa:number = 0;

  constructor(
    private fb: FormBuilder,
    private perfilesService: PerfilesService,
  )

  {
    this.UserForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  limpiarBotones(){
    this.UserForm.setValue({
      descripcion:"",
    })
  }

  ngOnInit(): void {

    const valor = sessionStorage.getItem('token');
    if (typeof valor === 'string') {
      var IdEmpleado = JSON.parse(atob(valor.split('.')[1]));
      //console.log('Empresa: ', IdEmpleado);
      this.strPerfil=IdEmpleado["Perfil"];
      this.IdEmpresa=IdEmpleado["IdEmpresa"];
    }
    this.titulo="Lista de Perfiles";
    this.getDataPerfiles(this.strPerfil);
  }

  sort(headerName:String){
    this.orderHeader=headerName;//
  }

  getDataPerfiles(Descripcion:string){
    this.perfilesService.MostrarPrmPerfil(Descripcion).subscribe(
      (resp: any) => {
        this.cargaListaPerfil = resp['$values'];
        //console.log("this.cargaListaPerfil:",this.cargaListaPerfil);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  IngresarMedio(){
    this.titulo="Ingreso de Perfiles";
    this.formSubmitted=false;
    this.IdPerfil=0;
    this.registroEm = true;
    this.verLista = false;
  }

  EditarMedio(id:number){

    this.perfilesService.MostrarPrmPerfilId(id).subscribe(
      (resp: any) => {
        this.medioId = resp['$values'];
        this.generica2 = this.medioId[0];
        this.registroEm = true;
        this.verLista = false;
        this.IdPerfil= this.generica2.idPerfil;
        this.UserForm.controls['descripcion'].setValue(this.generica2.descripcion);
        this.formSubmitted=false;
      },
      (err) => {
        console.log('err:', err);
      }
    );

  }


  RegresarLista(){
    this.titulo="Lista de Perfiles";
    //this.limpiarBotones();
    this.registroEm = false;
    this.verLista = true;
    this.formSubmitted=false;
    this.IdPerfil=0;
  }

  GuardarMedio(){
    if(this.IdPerfil==0)
    {
      this.formSubmitted=true;
      if(this.UserForm.invalid){
        return;
      }

      const data: Iperfil = {
        idPerfil: 0,
        descripcion: this.UserForm.controls['descripcion'].value,
        tipo: 1,
        estado: 1,
      };

      this.perfilesService.GuardarPrmPerfil(data).subscribe(
        (resp: any) => {
          this.comboProceso = resp['$values'];
          this.generica = this.comboProceso[0];
          //console.log("this.generica: ",this.generica);
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 1) {
            this.formSubmitted=false;
            this.limpiarBotones();
            this.RegresarLista();
            this.getDataPerfiles(this.strPerfil);
            alerts.basicAlert('Excelente', valor2, 'success');
          }
          else  if (valor1 == 4)
          {
            this.limpiarBotones();
            this.RegresarLista();
            this.getDataPerfiles(this.strPerfil);
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
      this.formSubmitted=true;
      if(this.UserForm.invalid){
        return;
      }

      const data: Iperfil = {
        idPerfil: this.IdPerfil,
        descripcion: this.UserForm.controls['descripcion'].value,
        tipo: 2,
        estado: 1,
      };
      console.log("data: ",data);
      this.perfilesService.GuardarPrmPerfil(data).subscribe(
        (resp: any) => {
          this.comboProceso = resp['$values'];
          this.generica = this.comboProceso[0];
          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 2) {
            this.formSubmitted=false;
            //this.limpiarBotones();
            this.RegresarLista();
            this.getDataPerfiles(this.strPerfil);
            alerts.basicAlert('Excelente', valor2, 'success');
          }
          else  if (valor1 == 4)
          {
            this.formSubmitted=false;
            //this.limpiarBotones();
            this.registroEm = false;
            this.verLista = true;
            this.getDataPerfiles(this.strPerfil);
            alerts.basicAlert('Excelente', valor2, 'success');
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );
    }
  }

  invalidField(field: string) {
    return functions.invalidField(field, this.UserForm, this.formSubmitted);
  }

}
