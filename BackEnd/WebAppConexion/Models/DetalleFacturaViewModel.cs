using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class DetalleFacturaViewModel
    {
        public Int64 IdFactura { get; set; }
        public string TipoDocumento { get; set; }
        public string NumDocumento { get; set; }
        public string Observacion { get; set; }
        public string Descripcion { get; set; }
        public string StrFechaEmision { get; set; }
        public DateTime FechaEmision { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Iva { get; set; }
        public decimal Total { get; set; }
    }
}
