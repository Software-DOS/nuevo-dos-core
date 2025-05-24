using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHDepartamentoViewModel
    {
        public int Tipo { get; set; }
        public long IdDepartamento { get; set; }
        public long? IdCelula { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Jefe { get; set; }
        public string Empresa { get; set; }
    }
}
