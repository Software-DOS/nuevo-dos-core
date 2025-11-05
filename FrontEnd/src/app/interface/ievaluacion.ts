// export interface Ievaluacion {
//   idEvaluacion: number;
//   idEmpleado: number;
//   idJefe: number;
//   anio: number;
//   estado: string;
//   fechaInicio: string;
//   fechaLimite: string;
//   fechaFinalizacion?: string;
//   calificacionFinal?: number;
//   observaciones?: string;
//   fechaCreacion: string;
//   fechaModificacion?: string;
//   usuarioCreacion: string;
// }

// export interface ICrearEvaluacionRequest {
//   tipo: number;
//   evaluacion: Ievaluacion;
// }

// export interface IEvaluacionResponse {
//   codigo: number;
//   mensaje: string;
//   idEvaluacion?: number;
//   idEmpleado?: number;
//   estado?: string;
//   fase?: number;
//   anio?: number;
// }


export interface Ievaluacion {
  tipo?: number; 
  idEvaluacion?: number;
  idEmpleado: number;
  idJefe?: number | null;          
  anio?: number;
  estado?: string;
  fechaInicio?: string;
  fechaLimite?: string;
  fechaFinalizacion?: string | null; // Permitir null
  calificacionFinal?: number | null; 
  observaciones?: string | null;     
  fechaCreacion?: string;
  fechaModificacion?: string | null; 
  usuarioCreacion?: string;
  fase?: number;
  retroalimentacion?: string;  
  planAccion?: string;    
  fechaRegObj?: string;
  fechaRegJefe?: string;
  fechaAutoevaluacion?: string;
  fechaEvaluacionJefe?: string;     
}

export interface ICrearEvaluacionRequest {
  tipo: number;                   // 1=Insertar, 2=Actualizar, 3=Eliminar, 4=Cambiar Estado, 5=Cambiar Fase
  evaluacion: Ievaluacion;
}

export interface IEvaluacionResponse {
  codigo: number;                 // > 0 = éxito (ID de evaluación), <= 0 = error
  mensaje: string;                // Mensaje descriptivo
  idEvaluacion?: number;          // ID de la evaluación (solo en creación exitosa)
  idEmpleado?: number;            // ID del empleado (solo en creación exitosa)
  estado?: string;                // Estado actual (solo en creación exitosa)
  fase?: number;                  // Fase actual (solo en creación exitosa)
  anio?: number;                  // Año de la evaluación (solo en creación exitosa)
}
