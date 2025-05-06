using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class EncabezadoPedidoViewModel
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
