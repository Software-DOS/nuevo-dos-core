using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHFormacionAcademicaViewModel
    {
        public long IdFormacion { get; set; }
        public long? IdInfoProf { get; set; }
        public string Institucion { get; set; }
        public DateTime? AnioInicio { get; set; }
        public DateTime? AnioGraduacion { get; set; }
        public string Especialidad { get; set; }
        public double? Promedio { get; set; }
        public string Descripcion { get; set; }
        public DateTime? UltimaActualizacion { get; set; }
    }
}
