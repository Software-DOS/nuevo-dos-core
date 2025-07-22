using System;

namespace WebAppConexion.Models
{
    public class GTHAsignacionCapacitacionDetalladaViewModel
    {
        // Información de la asignación
        public long IdAsignacion { get; set; }
        public long IdCapacitacion { get; set; }
        public long IdEmpleado { get; set; }
        public string CedulaEmpleado { get; set; }
        public DateTime? Fecha { get; set; }
        public int? Progreso { get; set; }

        // Información del empleado
        public EmpleadoInfo Empleado { get; set; }

        // Información de la capacitación
        public CapacitacionInfo Capacitacion { get; set; }
    }

    // EmpleadoInfo y CapacitacionInfo se reutilizan desde WebAppConexion.Models
}
