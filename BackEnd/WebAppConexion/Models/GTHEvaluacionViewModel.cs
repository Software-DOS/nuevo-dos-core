using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHEvaluacionViewModel
    {
        public int Tipo { get; set; } = 1;
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
        public int? Fase { get; set; }
        
        //// Propiedades adicionales para información del empleado
        //public string NombreEmpleado { get; set; }
        //public string ApellidoEmpleado { get; set; }
        //public string AreaEmpleado { get; set; }
        //public string NombreCompleto => $"{NombreEmpleado} {ApellidoEmpleado}".Trim();
        
        //// Propiedades adicionales para información del jefe
        //public string NombreJefe { get; set; }
        //public string ApellidoJefe { get; set; }
        //public string NombreCompletoJefe => $"{NombreJefe} {ApellidoJefe}".Trim();
        
        //// Estadísticas de la evaluación
        //public int? TotalObjetivos { get; set; }
        //public int? ObjetivosEvaluados { get; set; }
        //public decimal? PromedioObjetivos { get; set; }
        //public int? TotalCompetencias { get; set; }
        //public int? CompetenciasEvaluadas { get; set; }
        //public decimal? PromedioCompetencias { get; set; }
    }
}
