export interface IGTHCompetencia {
  idCompetencia?: number;
  nombreCompetencia?: string;
  descripcion?: string;
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
