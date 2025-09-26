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
  CalificacionFinal?: number;
  ComentariosEmpleado?: string;
  ComentariosJefe?: string;
  FechaAutoevaluacion?: Date;
  FechaEvaluacionJefe?: Date;
  Estado?: string;
  FechaCreacion?: Date;
}

