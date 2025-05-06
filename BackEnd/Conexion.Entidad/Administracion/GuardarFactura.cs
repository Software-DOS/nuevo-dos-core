using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GuardarFactura
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
