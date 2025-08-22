export interface Idependiente {
  CedulaEmpleado: string; 
  DepNombre: string; 
  DepFechaNacimiento: string;  
  DepDiscapacidad?: boolean | "";   // <-- ahora acepta vacío también
  DepDocumentoUrl: string; 
  DepRelacion: string; 
}
