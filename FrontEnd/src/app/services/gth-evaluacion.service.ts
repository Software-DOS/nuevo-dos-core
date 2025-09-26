import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { 
  Ievaluacion, 
  ICrearEvaluacionRequest, 
  IEvaluacionResponse
} from '../interface/ievaluacion';

@Injectable({
  providedIn: 'root'
})
export class GthEvaluacionService {

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos las evaluaciones
   */
  MostrarEvaluaciones() {
      return this.http.get<Ievaluacion[]>(
        environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
        {
          params: {
            tipo: '0'
          }
        }
      );
    }

  /**
  * Obtener todos las evaluaciones por empleado
  */
  MostrarEvaluacionesPorEmpleado(idEmpleado: string) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '2',
          idEmpleado: idEmpleado
        }
      }
    );
  }

  /**
  * Obtener todos las evaluaciones por empleado
  */
  MostrarEvaluacionesPorEstado(estado: string) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '4',
          estado: estado
        }
      }
    );
  }

  /**
  * Obtener todos las evaluaciones por empleado y año
  */
  MostrarEvaluacionesPorEmpleadoyAnio(idEmpleado: number, anio: number) {
    return this.http.get<Ievaluacion[]>(
      environment.urlbackend + 'api/GTHEvaluacion/Mostrar',
      {
        params: {
          tipo: '6',
          idEmpleado: idEmpleado.toString(), // importante convertir a string
          anio: anio.toString()
        }
      }
    );
  }

  /**
   * Crear evaluación GTH - FORMATO CORREGIDO
   */
  crearGthEvaluacion(evaluacion: Ievaluacion): Observable<any> {
    const requestData = {
      tipo: 1,
      idEmpleado: evaluacion.idEmpleado,
      idJefe: evaluacion.idJefe,
      anio: evaluacion.anio || new Date().getFullYear(),
      estado: evaluacion.estado || 'PENDIENTE',
      usuarioCreacion: evaluacion.usuarioCreacion || 'SISTEMA',
      fase: evaluacion.fase || 0
    };
    
    return this.http.post(`${environment.urlbackend}api/GTHEvaluacion/Gestionar`, requestData);
  }
  /**
  * Guardar o actualizar evaluacion GTH  la FASE Debe ser 1 o mayor a 0
  */
  GuardarGthEvaluacion(data:Ievaluacion){
        return this.http.post(environment.urlbackend +"api/GTHEvaluacion/Gestionar",data);
    }

}
