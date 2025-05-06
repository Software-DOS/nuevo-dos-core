using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class PermisoEmpleadoViewModel
    {
        public Int64 IdMenu { get; set; }
        public string Titulo { get; set; }
        public int Estado { get; set; }
        public bool ValorBool { get; set; }
    }
}
