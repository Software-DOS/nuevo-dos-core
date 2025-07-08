import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { iGTHEmpleado } from '../interface/igth-empleado';

@Injectable({
  providedIn: 'root'
})
export class GthEmpleadoService {
 
  constructor(private http: HttpClient) { }
 
  /**
   * Obtener todos los empleados GTH
   */
  Mostrar(){
    return this.http.get(environment.urlbackend + "api/GTHEmpleado/Mostrar");
  }

  /**
   * Obtener empleados GTH con parámetros específicos
   * @param tipo - Tipo de consulta (0 = Todos, 1 = Por ID/Cédula, 2 = Por Célula, 3 = Por Estado, 4 = Por Cédula exclusiva)
   * @param idEmpleado - ID del empleado específico
   * @param idCelula - ID de la célula
   * @param estadoEmpleado - Estado del empleado
   * @param cedulaEmpleado - Cédula del empleado
   */
  MostrarConParametros(tipo: number = 0, idEmpleado?: number, idCelula?: number, estadoEmpleado?: string, cedulaEmpleado?: string){
    let params = `?tipo=${tipo}`;
    if (idEmpleado) params += `&idEmpleado=${idEmpleado}`;
    if (idCelula) params += `&idCelula=${idCelula}`;
    if (estadoEmpleado) params += `&estadoEmpleado=${estadoEmpleado}`;
    if (cedulaEmpleado) params += `&cedulaEmpleado=${cedulaEmpleado}`;
    
    return this.http.get(environment.urlbackend + "api/GTHEmpleado/Mostrar" + params);
  }

  /**
   * Buscar empleado específicamente por cédula
   * @param cedula - Cédula del empleado a buscar
   */
  BuscarPorCedula(cedula: string){
    return this.MostrarConParametros(4, undefined, undefined, undefined, cedula);
  }

  /**
   * Guardar o actualizar empleado GTH
   */
  GuardarGthEmpleado(data:iGTHEmpleado){
      return this.http.post(environment.urlbackend +"api/GTHEmpleado/Gestionar",data);
  }

  /**
   * Gestionar empleado GTH (alias para GuardarGthEmpleado)
   */
  gestionarEmpleado(data:iGTHEmpleado){
      return this.GuardarGthEmpleado(data);
  }
 
}