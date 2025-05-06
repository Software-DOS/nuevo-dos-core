import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IclienteServicio } from 'src/app/interface/icliente-servicio';
import { ClienteServicioService } from 'src/app/services/cliente-servicio.service';
import { TributarioService } from 'src/app/services/tributario.service';

import Swal, { SweetAlertIcon } from 'sweetalert2';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-model-cliente',
  templateUrl: './model-cliente.component.html',
  styleUrls: ['./model-cliente.component.css'],
})
export class ModelClienteComponent implements OnInit {
  UserForm!: FormGroup;

  //Variables
  idValor: number = 0;
  public titulo: string = '';
  NCliente = false;
  verCliente = true;

  //variable que valida el envio del formulario
  formSubmitted = false;

  //combo
  public comboTipoIdentificacion: any = [];
  public cargaListaCliente: any = [];

  public generica: any = [];
  public cargaInicial: any = [];

  public genericaCliente: any = [];
  public cargaInicialCliente: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModelClienteComponent>,
    @Inject(MAT_DIALOG_DATA) message: string,
    private fb: FormBuilder,
    private clienteServicioService: ClienteServicioService,
    private tributarioService: TributarioService,
  ) {
    this.UserForm = this.fb.group({
      identificacion: [''],
      idTipoIdentificacion: [''],
      descripcion: [''],
      direccion: [''],
      email: [''],
      telefono: [''],
    });
  }

  ngOnInit(): void {
    this.titulo = 'Lista de Clientes';
    this.getDataTipoIdentificacion();
    this.getDataListaClientes();
  }

  ListaCliente() {
    this.titulo = 'Lista de Clientes';
    this.verCliente = true;
    this.NCliente = false;
  }

  NuevoCliente() {
    this.titulo = 'Nuevo Clientes';
    this.verCliente = false;
    this.NCliente = true;
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

  getDataListaClientes() {
    this.clienteServicioService.MostrarListaClientes(0, 0).subscribe(
      (resp: any) => {
        this.cargaListaCliente = resp['$values'];
        console.log('this.cargaListaCliente:', this.cargaListaCliente);
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }

  GuardarCliente() {
    if (this.idValor == 0) {
      this.formSubmitted = true;
      if (this.UserForm.invalid) {
        return;
      }

      const data: IclienteServicio = {
        IdClienteServicio: 0,
        IdTipoIdentificacion:
          this.UserForm.controls['idTipoIdentificacion'].value,
        RuCedula: this.UserForm.controls['identificacion'].value,
        Descripcion: this.UserForm.controls['descripcion'].value,
        Direccion: this.UserForm.controls['direccion'].value,
        Email: this.UserForm.controls['email'].value,
        Telefono: this.UserForm.controls['telefono'].value,
        Estado: 1,
        Tipo: 1,
      };
      this.clienteServicioService.GuardarClienteServicio(data).subscribe(
        (resp: any) => {
          this.cargaInicial = resp['$values'];
          this.generica = this.cargaInicial[0];

          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 1) {
            //this.dialogRef.close();
            this.getDataListaClientes();
            this.ListaCliente();
            //alerts.basicAlert("Excelente",valor2,"success");
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );
    } else {
      this.formSubmitted = true;
      if (this.UserForm.invalid) {
        return;
      }

      const data: IclienteServicio = {
        IdClienteServicio: this.idValor,
        IdTipoIdentificacion:
          this.UserForm.controls['idTipoIdentificacion'].value,
        RuCedula: this.UserForm.controls['identificacion'].value,
        Descripcion: this.UserForm.controls['descripcion'].value,
        Direccion: this.UserForm.controls['direccion'].value,
        Email: this.UserForm.controls['email'].value,
        Telefono: this.UserForm.controls['telefono'].value,
        Estado: 1,
        Tipo: 2,
      };
      this.clienteServicioService.GuardarClienteServicio(data).subscribe(
        (resp: any) => {
          this.cargaInicial = resp['$values'];
          this.generica = this.cargaInicial[0];

          let valor1;
          let valor2;
          valor1 = this.generica.valor1;
          valor2 = this.generica.valor2;
          if (valor1 == 2) {
            //this.dialogRef.close();
            this.getDataListaClientes();
            this.ListaCliente();
            //alerts.basicAlert("Excelente",valor2,"success");
          }
        },
        (err) => {
          console.log('err:', err);
        }
      );
    }
  }

  VerCliente(item: any) {
    //console.log("item: ",item);
    this.dialogRef.close({ id: item });
  }

  EditarCliente(item: any) {
    this.clienteServicioService.MostrarListaClientes(1, item).subscribe(
      (resp: any) => {
        this.cargaInicialCliente = resp['$values'];
        this.genericaCliente = this.cargaInicialCliente[0];
        this.UserForm.controls['descripcion'].setValue(
          this.genericaCliente.descripcion
        );
        this.UserForm.controls['direccion'].setValue(
          this.genericaCliente.direccion
        );
        this.UserForm.controls['email'].setValue(this.genericaCliente.email);
        this.UserForm.controls['identificacion'].setValue(
          this.genericaCliente.ruCedula
        );
        this.UserForm.controls['idTipoIdentificacion'].setValue(
          this.genericaCliente.idTipoIdentificacion
        );
        this.UserForm.controls['telefono'].setValue(
          this.genericaCliente.telefono
        );
        this.idValor = this.genericaCliente.idClienteServicio;
        this.titulo = 'Editar Clientes';
        this.verCliente = false;
        this.NCliente = true;
      },
      (err) => {
        console.log('err:', err);
      }
    );
  }
}
