using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GuardarPrmPerfilViewModel
    {
        public Int64 IdPerfil { get; set; }
        public string Descripcion { get; set; }
        public int Tipo { get; set; }
        public int Estado { get; set; }
    }
}
