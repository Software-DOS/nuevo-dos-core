using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHExperienciaLaboralViewModel
    {
        public long IdExperiencia { get; set; }
        public long? IdInfoProf { get; set; }
        public string Empresa { get; set; }
        public string Cargo { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string Descripcion { get; set; }
    }
}
