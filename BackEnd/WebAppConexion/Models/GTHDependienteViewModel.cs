using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHDependienteViewModel
    {
        public int Tipo { get; set; }
        public int IdDependiente { get; set; }
        public string CedulaEmpleado { get; set; }
        public string DepNombre { get; set; }
        public DateTime? DepFechaNacimiento { get; set; }
        public bool? DepDiscapacidad { get; set; }
        public string DepDocumentoUrl { get; set; }
    }
}
