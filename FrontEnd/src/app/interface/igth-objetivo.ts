export interface IgthObjetivo {
  tipo?: number;
  idObjetivo?: number;
  idEvaluacion?: number;
  titulo?: string;
  descripcion?: string;
  tipoObjetivo?: string;
  peso?: number;
  valoracionEmpleado?: number | null;   
  valoracionJefe?: number | null;        
  calificacionEmpleado?: number | null;   
  calificacionFinal?: number | null;     
  fechaLimite?: string;
  comentariosEmpleado?: string;
  comentariosJefe?: string;
  estado?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  calificacionPonderada?: number | null; 
  resultadoPonderado?: number | null;
}