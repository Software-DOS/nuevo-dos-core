using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHSolicitudCapacitacionViewModel
    {
        public int Tipo { get; set; }
        public long IdCapacitacion { get; set; }
        public long IdEmpleado { get; set; }
        public string CedulaEmpleado { get; set; }
        public string Justificacion { get; set; }
        public DateTime? FechaSolicitud { get; set; }
        public string Respuesta { get; set; }
        public DateTime? FechaRespuesta { get; set; }
    }
}
