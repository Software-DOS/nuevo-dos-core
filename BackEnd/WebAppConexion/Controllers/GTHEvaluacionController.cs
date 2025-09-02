using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GTHEvaluacionController : Controller
    {
        private readonly GTHEvaluacionRepository _repository;
        private readonly IConfiguration _config;
        
        public GTHEvaluacionController(GTHEvaluacionRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de evaluaciones según los filtros proporcionados.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Empleado, 3=Por Estado, 4=Por Año
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHEvaluacionViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idEvaluacion = null,
            [FromQuery] long? idEmpleado = null,
            [FromQuery] string estado = null,
            [FromQuery] int? anio = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idEvaluacion, idEmpleado, estado, anio);

            // Mapear cada GTHEvaluacion a su ViewModel
            return entidades.Select(e => new GTHEvaluacionViewModel
            {
                IdEvaluacion = e.IdEvaluacion,
                IdEmpleado = e.IdEmpleado,
                IdJefe = e.IdJefe,
                Anio = e.Anio,
                Estado = e.Estado,
                FechaInicio = e.FechaInicio,
                FechaLimite = e.FechaLimite,
                FechaFinalizacion = e.FechaFinalizacion,
                CalificacionFinal = e.CalificacionFinal,
                Observaciones = e.Observaciones,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion,
                UsuarioCreacion = e.UsuarioCreacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de evaluación:
        /// 1 = Insertar, 2 = Actualizar, 3 = Eliminar, 4 = Cambiar Estado.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHEvaluacionViewModel model)
        {
            // Mapear ViewModel a la entidad GTHEvaluacion
            var db = new GTHEvaluacion
            {
                Tipo = model.Tipo,
                IdEvaluacion = model.IdEvaluacion,
                IdEmpleado = model.IdEmpleado,
                IdJefe = model.IdJefe,
                Anio = model.Anio,
                Estado = model.Estado ?? "PENDIENTE",
                FechaInicio = model.FechaInicio,
                FechaLimite = model.FechaLimite,
                FechaFinalizacion = model.FechaFinalizacion,
                CalificacionFinal = model.CalificacionFinal,
                Observaciones = model.Observaciones,
                FechaCreacion = model.FechaCreacion,
                FechaModificacion = model.FechaModificacion,
                UsuarioCreacion = model.UsuarioCreacion
            };

            var responseResult = await _repository.Gestionar(db.Tipo, db);

            // Devolver la respuesta mapeada a Generica
            return responseResult.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

        /// <summary>
        /// Obtiene una evaluación específica por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { mensaje = "ID de evaluación inválido" });
                }

                // Usar tipo 1 para búsqueda por ID
                var evaluaciones = await _repository.Mostrar(1, id);
                var evaluacion = evaluaciones.FirstOrDefault();

                if (evaluacion == null)
                {
                    return NotFound(new { mensaje = "No se encontró la evaluación especificada" });
                }

                // Mapear a ViewModel
                var viewModel = new GTHEvaluacionViewModel
                {
                    IdEvaluacion = evaluacion.IdEvaluacion,
                    IdEmpleado = evaluacion.IdEmpleado,
                    IdJefe = evaluacion.IdJefe,
                    Anio = evaluacion.Anio,
                    Estado = evaluacion.Estado,
                    FechaInicio = evaluacion.FechaInicio,
                    FechaLimite = evaluacion.FechaLimite,
                    FechaFinalizacion = evaluacion.FechaFinalizacion,
                    CalificacionFinal = evaluacion.CalificacionFinal,
                    Observaciones = evaluacion.Observaciones,
                    FechaCreacion = evaluacion.FechaCreacion,
                    FechaModificacion = evaluacion.FechaModificacion,
                    UsuarioCreacion = evaluacion.UsuarioCreacion
                };

                return Ok(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todas las evaluaciones de un empleado específico.
        /// </summary>
        [HttpGet("empleado/{idEmpleado}")]
        public async Task<IEnumerable<GTHEvaluacionViewModel>> ObtenerPorEmpleado(long idEmpleado)
        {
            // Usar tipo 2 para búsqueda por empleado
            var entidades = await _repository.Mostrar(2, null, idEmpleado);

            return entidades.Select(e => new GTHEvaluacionViewModel
            {
                IdEvaluacion = e.IdEvaluacion,
                IdEmpleado = e.IdEmpleado,
                IdJefe = e.IdJefe,
                Anio = e.Anio,
                Estado = e.Estado,
                FechaInicio = e.FechaInicio,
                FechaLimite = e.FechaLimite,
                FechaFinalizacion = e.FechaFinalizacion,
                CalificacionFinal = e.CalificacionFinal,
                Observaciones = e.Observaciones,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion,
                UsuarioCreacion = e.UsuarioCreacion
            });
        }

        /// <summary>
        /// Cambia el estado de una evaluación específica.
        /// </summary>
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] CambiarEstadoRequest request)
        {
            try
            {
                var model = new GTHEvaluacionViewModel
                {
                    Tipo = 4, // Tipo 4 = Cambiar Estado
                    IdEvaluacion = id,
                    Estado = request.Estado
                };

                var db = new GTHEvaluacion
                {
                    Tipo = model.Tipo,
                    IdEvaluacion = model.IdEvaluacion,
                    Estado = model.Estado
                };

                var result = await _repository.Gestionar(db.Tipo, db);
                var response = result.FirstOrDefault();

                if (response != null && response.valor1 > 0)
                {
                    return Ok(new { mensaje = response.valor2 });
                }
                else
                {
                    return BadRequest(new { mensaje = response?.valor2 ?? "Error al cambiar estado" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        #region Métodos auxiliares

        private string ObtenerDescripcionEstado(string estado)
        {
            return estado switch
            {
                "PENDIENTE" => "Pendiente de Iniciar",
                "EN_PROCESO" => "En Proceso",
                "AUTOEVALUACION_COMPLETA" => "Autoevaluación Completa",
                "EVALUACION_JEFE_COMPLETA" => "Evaluación del Jefe Completa",
                "COMPLETADA" => "Completada",
                "CANCELADA" => "Cancelada",
                _ => estado ?? "Sin Estado"
            };
        }

        private int CalcularPorcentajeCompletado(string estado)
        {
            return estado switch
            {
                "PENDIENTE" => 0,
                "EN_PROCESO" => 25,
                "AUTOEVALUACION_COMPLETA" => 50,
                "EVALUACION_JEFE_COMPLETA" => 75,
                "COMPLETADA" => 100,
                "CANCELADA" => 0,
                _ => 0
            };
        }

        #endregion
    }

    // Clase auxiliar para el request de cambio de estado
    public class CambiarEstadoRequest
    {
        public string Estado { get; set; }
    }
}
