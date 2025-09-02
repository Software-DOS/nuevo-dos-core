using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHNivelCompetenciaViewModel
    {
        public int Tipo { get; set; }
        public int IdNivelCompetencia { get; set; }
        public int IdCompetencia { get; set; }
        public int Nivel { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        
        // Propiedades adicionales para JOIN con competencia
        public string NombreCompetencia { get; set; }
        public string DescripcionCompetencia { get; set; }
    }
}
