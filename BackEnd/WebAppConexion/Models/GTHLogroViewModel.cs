using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHLogroViewModel
    {
        public long IdLogro { get; set; }
        public long? IdInfoProf { get; set; }
        public string Titulo { get; set; }
        public string Tipo { get; set; }
        public string Descripcion { get; set; }
        public DateTime? FechaLogro { get; set; }
        public string Evidencia { get; set; }
    }
}
