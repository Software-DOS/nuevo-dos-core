using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Negocio
{
    public class DetallePedido
    {
        public Int64 IdDetalle { get; set; }
        public Int64 IdPedido { get; set; }
        public decimal  Cantidad { get; set; }
        public string Detalle { get; set; }
        public decimal Precio { get; set; }
        public decimal Iva { get; set; }
        public decimal Total { get; set; }
        public Int32 Porcentaje { get; set; }
        public Int64 IdInventario { get; set; }
        public string Observacion { get; set; }
    }
}
