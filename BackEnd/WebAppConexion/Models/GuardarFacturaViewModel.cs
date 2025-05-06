using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GuardarFacturaViewModel
    {
        public Int64 IdEmpresa { get; set; }
        public string JsonPedido { get; set; }
        public string JsonCliente { get; set; }
        public string JsonEncabezado { get; set; }
        public string Observacion { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
