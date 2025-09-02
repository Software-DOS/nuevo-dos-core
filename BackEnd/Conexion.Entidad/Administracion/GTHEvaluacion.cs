using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHEvaluacion
    {
        public int Tipo { get; set; }
        public int IdEvaluacion { get; set; }
        public long IdEmpleado { get; set; }
        public long? IdJefe { get; set; }
        public int Anio { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaLimite { get; set; }
        public DateTime? FechaFinalizacion { get; set; }
        public decimal? CalificacionFinal { get; set; }
        public string Observaciones { get; set; }
        public string UsuarioCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
    }
}
