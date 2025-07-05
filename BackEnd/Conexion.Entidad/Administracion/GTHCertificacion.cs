using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHCertificacion
    {
        public int Tipo { get; set; }
        public int IdCertificacion { get; set; }
        public string CedulaEmpleado { get; set; }
        public string CerTitulo { get; set; }
        public string CerInstitucion { get; set; }
        public DateTime? CerFecha { get; set; }
        public string CerCertificadoUrl { get; set; }
    }
}
