using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class PrmMenu
    {
        public Int64 IdMenu { get; set; }
        public Int64 IdPadre { get; set; }
        public string Titulo { get; set; }
        public string Ruta { get; set; }
        public string Icono { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
        public List<SubMenu> subMenu { get; set; }
    }
}
