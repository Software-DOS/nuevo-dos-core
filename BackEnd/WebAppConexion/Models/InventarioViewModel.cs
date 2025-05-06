using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class InventarioViewModel
    {
        public Int64 IdInventario { get; set; }
        public Int64 IdEmpresa { get; set; }
        public string CodigoPrincipal { get; set; }
        public string CodigoBarra { get; set; }
        public string Descripcion { get; set; }
        public decimal Stock { get; set; }
        public decimal PrecioPublico { get; set; }
        public decimal Costo { get; set; }
        public string Servicio { get; set; }
        public int Iva { get; set; }
        public string Imagen { get; set; }
        public string Impresion { get; set; }
        public string json { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
        public string ListaPrecios { get; set; }
    }
}
