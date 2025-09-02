using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHObjetivoViewModel
    {
        public int Tipo { get; set; }
        public int IdObjetivo { get; set; }
        public int IdEvaluacion { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string TipoObjetivo { get; set; }
        public decimal? Peso { get; set; }
        public int? ValoracionEmpleado { get; set; }
        public int? ValoracionJefe { get; set; }
        public int? CalificacionFinal { get; set; }
        public DateTime? FechaLimite { get; set; }
        public string ComentariosEmpleado { get; set; }
        public string ComentariosJefe { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        
        // Propiedades calculadas
        public string TipoObjetivoDescripcion => TipoObjetivo switch
        {
            "INDIVIDUAL" => "Objetivo Individual",
            "AREA" => "Objetivo de Área",
            "EMPRESA" => "Objetivo Empresarial",
            _ => TipoObjetivo
        };
        
        public string EstadoDescripcion => Estado switch
        {
            "ACTIVO" => "Activo",
            "MODIFICADO" => "Modificado",
            "CANCELADO" => "Cancelado",
            "COMPLETADO" => "Completado",
            _ => Estado
        };
        
        public string DiferenciaEvaluacion => 
            ValoracionEmpleado.HasValue && ValoracionJefe.HasValue 
                ? (ValoracionJefe.Value - ValoracionEmpleado.Value).ToString("+0;-0;0")
                : null;
        
        public bool EstaVencido => FechaLimite.HasValue && FechaLimite.Value < DateTime.Now;
        
        public int? DiasParaVencimiento => FechaLimite.HasValue 
            ? (int?)(FechaLimite.Value - DateTime.Now).TotalDays
            : null;
        
        public string EstadoVencimiento => 
            DiasParaVencimiento.HasValue 
                ? DiasParaVencimiento.Value < 0 
                    ? $"Vencido hace {Math.Abs(DiasParaVencimiento.Value)} días"
                    : DiasParaVencimiento.Value == 0 
                        ? "Vence hoy"
                        : $"Vence en {DiasParaVencimiento.Value} días"
                : "Sin fecha límite";
    }
}
