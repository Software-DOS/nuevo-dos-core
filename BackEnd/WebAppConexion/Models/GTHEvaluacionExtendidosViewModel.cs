using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    /// <summary>
    /// ViewModel para el resumen completo de una evaluación
    /// Usado por el SP GTH_ResumenEvaluacion
    /// </summary>
    public class GTHResumenEvaluacionViewModel
    {
        // Información básica de la evaluación
        public GTHEvaluacionViewModel Evaluacion { get; set; }
        
        // Lista de objetivos
        public List<GTHObjetivoViewModel> Objetivos { get; set; }
        
        // Lista de competencias evaluadas
        public List<GTHAsignacionCompetenciaViewModel> Competencias { get; set; }
        
        // Estadísticas calculadas
        public decimal? PromedioObjetivos { get; set; }
        public decimal? PromedioCompetencias { get; set; }
        public decimal? CalificacionFinalCalculada { get; set; }
        public int TotalObjetivos { get; set; }
        public int ObjetivosCompletados { get; set; }
        public int TotalCompetencias { get; set; }
        public int CompetenciasEvaluadas { get; set; }
        public decimal PorcentajeAvance { get; set; }
        
        public GTHResumenEvaluacionViewModel()
        {
            Objetivos = new List<GTHObjetivoViewModel>();
            Competencias = new List<GTHAsignacionCompetenciaViewModel>();
        }
    }
    
    /// <summary>
    /// ViewModel para estadísticas del sistema de evaluación
    /// Usado por el SP GTH_EstadisticasEvaluacion
    /// </summary>
    public class GTHEstadisticasEvaluacionViewModel
    {
        // Estadísticas generales
        public int TotalEvaluaciones { get; set; }
        public int Pendientes { get; set; }
        public int EnProceso { get; set; }
        public int Completadas { get; set; }
        public int Canceladas { get; set; }
        public decimal? PromedioCalificacion { get; set; }
        
        // Distribución por estado
        public List<EstadisticaPorEstado> DistribucionEstados { get; set; }
        
        // Top competencias
        public List<CompetenciaMejorEvaluada> TopCompetencias { get; set; }
        
        // Distribución de calificaciones
        public List<DistribucionCalificacion> DistribucionCalificaciones { get; set; }
        
        public GTHEstadisticasEvaluacionViewModel()
        {
            DistribucionEstados = new List<EstadisticaPorEstado>();
            TopCompetencias = new List<CompetenciaMejorEvaluada>();
            DistribucionCalificaciones = new List<DistribucionCalificacion>();
        }
    }
    
    public class EstadisticaPorEstado
    {
        public string Estado { get; set; }
        public int Cantidad { get; set; }
        public decimal Porcentaje { get; set; }
    }
    
    public class CompetenciaMejorEvaluada
    {
        public string NombreCompetencia { get; set; }
        public int VecesEvaluada { get; set; }
        public decimal PromedioCalificacion { get; set; }
    }
    
    public class DistribucionCalificacion
    {
        public string RangoCalificacion { get; set; }
        public int Cantidad { get; set; }
        public decimal Porcentaje { get; set; }
    }
    
    /// <summary>
    /// ViewModel para crear/asignar competencias estándar
    /// </summary>
    public class GTHAsignarCompetenciasRequest
    {
        public int IdEvaluacion { get; set; }
        public int NivelDefecto { get; set; } = 3;
        public List<int> CompetenciasSeleccionadas { get; set; }
        
        public GTHAsignarCompetenciasRequest()
        {
            CompetenciasSeleccionadas = new List<int>();
        }
    }
    
    /// <summary>
    /// ViewModel para respuesta de operaciones CRUD
    /// </summary>
    public class GTHOperacionResponse
    {
        public int Codigo { get; set; }
        public string Mensaje { get; set; }
        public object Data { get; set; }
        public bool Exitoso => Codigo > 0;
    }
}
