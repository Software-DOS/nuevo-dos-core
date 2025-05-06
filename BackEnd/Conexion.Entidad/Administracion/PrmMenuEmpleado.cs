using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class PrmMenuEmpleado
    {
        public Int64 IdMenuEmpleado { get; set; }
        public Int64 IdMenu { get; set; }
        public Int64 IdEmpleado { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
