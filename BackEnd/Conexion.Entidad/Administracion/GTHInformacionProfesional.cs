using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHInformacionProfesional
    {
        public int Tipo { get; set; }
        public long IdInfoProf { get; set; }
        public long? IdEmpleado { get; set; }
        public string CedulaEmpleado { get; set; }
        public string DescripcionProfesional { get; set; }
        public string PerfilLinkedIn { get; set; }
        public DateTime? FechaCreacion { get; set; }
    }
}
