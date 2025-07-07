using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHAsignacionCapacitacion
    {
        public int Tipo { get; set; }
        public long IdCapacitacion { get; set; }
        public long IdEmpleado { get; set; }
        public DateTime? Fecha { get; set; }
        public int? Progreso { get; set; }
    }
}
