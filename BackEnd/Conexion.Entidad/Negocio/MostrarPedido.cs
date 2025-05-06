using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Negocio
{
    public class MostrarPedido
    {
        public Int64 IdPedido { get; set; }
        public string Cliente { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string StrFechaRegistro { get; set; }
        public decimal Total { get; set; }
        public int Estado { get; set; }
    }
}
