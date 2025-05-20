using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHDepartamento
    {
        public long IdDepartamento { get; set; }
        public long? IdCelula { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Jefe { get; set; }
        public string Empresa { get; set; }
    }
}
