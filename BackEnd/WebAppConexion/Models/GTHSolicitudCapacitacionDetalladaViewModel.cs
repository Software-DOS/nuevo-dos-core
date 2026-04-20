using System;

namespace WebAppConexion.Models
{
    public class GTHSolicitudCapacitacionDetalladaViewModel
    {
        // Información de la solicitud
        public long IdSolicitud { get; set; }
        public long IdCapacitacion { get; set; }
        public long IdEmpleado { get; set; }
        public string CedulaEmpleado { get; set; }
        public string Justificacion { get; set; }
        public DateTime? FechaSolicitud { get; set; }
        public string Respuesta { get; set; }
        public DateTime? FechaRespuesta { get; set; }

        // Información del empleado
        public EmpleadoInfo Empleado { get; set; }

        // Información de la capacitación
        public CapacitacionInfo Capacitacion { get; set; }
    }

    public class EmpleadoInfo
    {
        public long IdEmpleado { get; set; }
        public string Cedula { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreCompleto => $"{Nombre} {Apellido}".Trim();
        public string Correo { get; set; }
        public string CorreoCorporativo { get; set; }
        public string Telefono { get; set; }
        public string CargoActual { get; set; }
        public string Area { get; set; }
        public string EstadoEmpleado { get; set; }
    }

    public class CapacitacionInfo
    {
        public long IdCapacitacion { get; set; }
        public string Nombre { get; set; }
        public string Titulo { get; set; }
        public string Categoria { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public int? Duracion { get; set; }
        public double? Costo { get; set; }
        public string Modalidad { get; set; }
        public string Observaciones { get; set; }
    }
}
