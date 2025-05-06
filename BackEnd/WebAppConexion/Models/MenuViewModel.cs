using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class MenuViewModel
    {
        public Int64 IdMenu { get; set; }
        public Int64 IdPadre { get; set; }
        public string Titulo { get; set; }
        public string Ruta { get; set; }
        public string Icono { get; set; }
        public int Estado { get; set; }
        public List<MenuViewModel> subMenu { get; set; }
    }
}
