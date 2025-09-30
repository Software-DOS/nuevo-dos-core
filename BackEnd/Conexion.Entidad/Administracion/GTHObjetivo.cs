using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class GTHObjetivo
    {
        public int Tipo { get; set; }
        public int IdObjetivo { get; set; }
        public int IdEvaluacion { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string TipoObjetivo { get; set; }
        public decimal Peso { get; set; }
        public int? ValoracionEmpleado { get; set; }
        public int? ValoracionJefe { get; set; }
        public int? CalificacionEmpleado { get; set; }
        public int? CalificacionFinal { get; set; }
        public DateTime? FechaLimite { get; set; }
        public string ComentariosEmpleado { get; set; }
        public string ComentariosJefe { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
    }
}
