using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class PermisoEmpleado
    {
        public Int64 IdMenu { get; set; }
        public string Titulo { get; set; }
        public int Estado { get; set; }
        public bool ValorBool { get; set; }
    }
}
