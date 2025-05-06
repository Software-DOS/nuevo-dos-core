using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class PrmPerfil
    {
        public Int64 IdPerfil { get; set; }
        public string Descripcion { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
