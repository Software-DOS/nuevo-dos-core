using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHCapacitacionViewModel
    {
        public int Tipo { get; set; }
        public long IdCapacitacion { get; set; }
        public long? IdEntidadCap { get; set; }
        public string Nombre { get; set; }
        public string Titulo { get; set; }
        public string Categoria { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public DateTime? FechaExpiracion { get; set; }
        public string UrlVerificacion { get; set; }
        public string ArchivosAdjuntos { get; set; }
        public string Observaciones { get; set; }
        public int? Duracion { get; set; }
        public double? Costo { get; set; }
        public string Modalidad { get; set; }
    }
}
