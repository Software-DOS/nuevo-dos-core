using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHAsignacionCompetenciaViewModel
    {
        public int Tipo { get; set; } = 1;
        public int IdAsignacion { get; set; }
        public int IdEvaluacion { get; set; }
        public int IdNivelCompetencia { get; set; }
        public int? ValoracionEmpleado { get; set; }
        public int? ValoracionJefe { get; set; }
        public int? CalificacionFinal { get; set; }
        public string ComentariosEmpleado { get; set; }
        public string ComentariosJefe { get; set; }
        public DateTime? FechaAutoevaluacion { get; set; }
        public DateTime? FechaEvaluacionJefe { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        
        // Propiedades adicionales para información de la competencia
        public int IdCompetencia { get; set; }
        public int Nivel { get; set; }
        public string DescripcionNivel { get; set; }
        public string NombreCompetencia { get; set; }
        public string DescripcionCompetencia { get; set; }
        
        // Propiedades calculadas
        public string EstadoDescripcion => Estado switch
        {
            "PENDIENTE" => "Pendiente de evaluación",
            "AUTOEVALUADO" => "Autoevaluación completada",
            "EVALUADO" => "Evaluación del jefe completada",
            "FINALIZADO" => "Evaluación finalizada",
            _ => Estado
        };
        
        public string DiferenciaEvaluacion => 
            ValoracionEmpleado.HasValue && ValoracionJefe.HasValue 
                ? (ValoracionJefe.Value - ValoracionEmpleado.Value).ToString("+0;-0;0")
                : null;
    }
}
