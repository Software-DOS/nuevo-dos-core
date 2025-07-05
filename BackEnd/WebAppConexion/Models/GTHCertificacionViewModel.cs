using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHCertificacionViewModel
    {
        public int Tipo { get; set; }
        public int IdCertificacion { get; set; }
        public string CedulaEmpleado { get; set; }
        public string CerTitulo { get; set; }
        public string CerInstitucion { get; set; }
        public string CerFecha { get; set; }
        public string CerCertificadoUrl { get; set; }
    }
}
