using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Negocio
{
    public class EncabezadoPedido
    {
        public Int64 IdPedido { get; set; }
        public Int64 IdEmpresa { get; set; }
        public string Cliente { get; set; }
        public string Observacion { get; set; }
        public string FechaRegistro { get; set; }
        public int Estado { get; set; }
        public string Json { get; set; }
        public int Tipo { get; set; }

    }
}
