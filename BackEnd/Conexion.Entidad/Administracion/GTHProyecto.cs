using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHProyecto
    {
        public int Tipo { get; set; }
        public int IdProyecto { get; set; }
        public string CedulaEmpleado { get; set; }
        public string ProTitulo { get; set; }
        public string ProEspecialidad { get; set; }
        public int? ProAnio { get; set; }
    }
}
