using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHCompetenciaViewModel
    {
        public int Tipo { get; set; }
        public int IdCompetencia { get; set; }
        public string NombreCompetencia { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string UsuarioCreacion { get; set; }
    }
}
