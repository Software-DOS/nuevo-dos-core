export interface IGTHCompetencia {
  idCompetencia?: number;
  NombreCompetencia?: string;
  descripcion?: string;
  TipoCompetencia?: string;
  estado?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

export interface IGTHCompetenciaViewModel {
  tipo?: number;
  idCompetencia?: number;
  nombreCompetencia?: string;
  descripcion?: string;
  estado?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

export interface IGTHNivelCompetenciaViewModel {
  tipo?: number;
  idNivelCompetencia?: number;
  nivel?: string;
  descripcion?: string;
  estado?: string;
}

export interface IGTHAsignacionCompetenciaViewModel{
  Tipo?: number;
  IdAsignacion?: number;
  IdEvaluacion?: number;
  IdNivelCompetencia?: number;
  ValoracionEmpleado?: number;
  ValoracionJefe?: number;
  CalificacionEmpleado?: number;
  CalificacionFinal?: number;
  FechaLimite?: Date;
  ComentariosEmpleado?: string;
  ComentariosJefe?: string;
  Estado?: string;
  FechaCreacion?: Date;
  fechaRegObj?: string;
  fechaRegJefe?: string;
  fechaAutoevaluacion?: string;
  fechaEvaluacionJefe?: string;  
}

