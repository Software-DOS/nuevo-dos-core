using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHNivelCompetencia
    {
        public int Tipo { get; set; }
        public int IdNivelCompetencia { get; set; }
        public int IdCompetencia { get; set; }
        public int Nivel { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
    }
}
