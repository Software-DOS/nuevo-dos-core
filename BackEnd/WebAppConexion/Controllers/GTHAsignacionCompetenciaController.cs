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
    public class GTHAsignacionCompetenciaController : Controller
    {
        private readonly GTHAsignacionCompetenciaRepository _repository;
        private readonly IConfiguration _config;
        
        public GTHAsignacionCompetenciaController(GTHAsignacionCompetenciaRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de asignaciones de competencia según los filtros proporcionados.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Evaluación, 3=Por Estado
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHAsignacionCompetenciaViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idAsignacion = null,
            [FromQuery] int? idEvaluacion = null,
            [FromQuery] string estado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idAsignacion, idEvaluacion, estado);

            // Mapear cada GTHAsignacionCompetencia a su ViewModel
            return entidades.Select(e => new GTHAsignacionCompetenciaViewModel
            {
                IdAsignacion = e.IdAsignacion,
                IdEvaluacion = e.IdEvaluacion,
                IdNivelCompetencia = e.IdNivelCompetencia,
                ValoracionEmpleado = e.ValoracionEmpleado,
                ValoracionJefe = e.ValoracionJefe,
                CalificacionEmpleado = e.CalificacionEmpleado,
                CalificacionFinal = e.CalificacionFinal,
                ComentariosEmpleado = e.ComentariosEmpleado,
                ComentariosJefe = e.ComentariosJefe,
                FechaLimite = e.FechaLimite,
                FechaAutoevaluacion = e.FechaAutoevaluacion,
                FechaEvaluacionJefe = e.FechaEvaluacionJefe,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de asignación de competencia:
        /// 1 = Insertar, 2 = Actualizar, 3 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHAsignacionCompetenciaViewModel model)
        {
            // Mapear ViewModel a la entidad GTHAsignacionCompetencia
            var db = new GTHAsignacionCompetencia
            {
                Tipo = model.Tipo,
                IdAsignacion = model.IdAsignacion,
                IdEvaluacion = model.IdEvaluacion,
                IdNivelCompetencia = model.IdNivelCompetencia,
                ValoracionEmpleado = model.ValoracionEmpleado,
                ValoracionJefe = model.ValoracionJefe,
                CalificacionEmpleado = model.CalificacionEmpleado,
                CalificacionFinal = model.CalificacionFinal,
                FechaLimite = model.FechaLimite,
                ComentariosEmpleado = model.ComentariosEmpleado,
                ComentariosJefe = model.ComentariosJefe,
                FechaAutoevaluacion = model.FechaAutoevaluacion,
                FechaEvaluacionJefe = model.FechaEvaluacionJefe,
                Estado = model.Estado ?? "PENDIENTE",
                FechaCreacion = model.FechaCreacion
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
        /// Obtiene una asignación de competencia específica por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { mensaje = "ID de asignación inválido" });
                }

                // Usar tipo 1 para búsqueda por ID
                var asignaciones = await _repository.Mostrar(1, id);
                var asignacion = asignaciones.FirstOrDefault();

                if (asignacion == null)
                {
                    return NotFound(new { mensaje = "No se encontró la asignación especificada" });
                }

                // Mapear a ViewModel
                var viewModel = new GTHAsignacionCompetenciaViewModel
                {
                    IdAsignacion = asignacion.IdAsignacion,
                    IdEvaluacion = asignacion.IdEvaluacion,
                    IdNivelCompetencia = asignacion.IdNivelCompetencia,
                    ValoracionEmpleado = asignacion.ValoracionEmpleado,
                    ValoracionJefe = asignacion.ValoracionJefe,
                    CalificacionEmpleado = asignacion.CalificacionEmpleado,
                    CalificacionFinal = asignacion.CalificacionFinal,
                    FechaLimite = asignacion.FechaLimite,
                    ComentariosEmpleado = asignacion.ComentariosEmpleado,
                    ComentariosJefe = asignacion.ComentariosJefe,
                    FechaAutoevaluacion = asignacion.FechaAutoevaluacion,
                    FechaEvaluacionJefe = asignacion.FechaEvaluacionJefe,
                    Estado = asignacion.Estado,
                    FechaCreacion = asignacion.FechaCreacion
                };

                return Ok(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todas las asignaciones de una evaluación específica.
        /// </summary>
        [HttpGet("evaluacion/{idEvaluacion}")]
        public async Task<IEnumerable<GTHAsignacionCompetenciaViewModel>> ObtenerPorEvaluacion(int idEvaluacion)
        {
            // Usar tipo 2 para búsqueda por evaluación
            var entidades = await _repository.Mostrar(2, null, idEvaluacion);

            return entidades.Select(e => new GTHAsignacionCompetenciaViewModel
            {
                IdAsignacion = e.IdAsignacion,
                IdEvaluacion = e.IdEvaluacion,
                IdNivelCompetencia = e.IdNivelCompetencia,
                ValoracionEmpleado = e.ValoracionEmpleado,
                ValoracionJefe = e.ValoracionJefe,
                CalificacionEmpleado = e.CalificacionEmpleado,
                CalificacionFinal = e.CalificacionFinal,
                FechaLimite = e.FechaLimite,
                ComentariosEmpleado = e.ComentariosEmpleado,
                ComentariosJefe = e.ComentariosJefe,
                FechaAutoevaluacion = e.FechaAutoevaluacion,
                FechaEvaluacionJefe = e.FechaEvaluacionJefe,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion
            });
        }

        /// <summary>
        /// Registra la autoevaluación de un empleado.
        /// </summary>
        [HttpPut("{id}/autoevaluacion")]
        public async Task<IActionResult> RegistrarAutoevaluacion(int id, [FromBody] AutoevaluacionRequest request)
        {
            try
            {
                var model = new GTHAsignacionCompetenciaViewModel
                {
                    Tipo = 2, // Tipo 2 = Actualizar
                    IdAsignacion = id,
                    ValoracionEmpleado = request.Valoracion,
                    ComentariosEmpleado = request.Comentarios,
                    FechaAutoevaluacion = DateTime.Now,
                    Estado = "AUTOEVALUACION_COMPLETA"
                };

                var result = await Gestionar(model);
                var response = result.FirstOrDefault();

                if (response != null && response.valor1 > 0)
                {
                    return Ok(new { mensaje = "Autoevaluación registrada exitosamente" });
                }
                else
                {
                    return BadRequest(new { mensaje = response?.valor2 ?? "Error al registrar autoevaluación" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Registra la evaluación del jefe.
        /// </summary>
        [HttpPut("{id}/evaluacion-jefe")]
        public async Task<IActionResult> RegistrarEvaluacionJefe(int id, [FromBody] EvaluacionJefeRequest request)
        {
            try
            {
                var model = new GTHAsignacionCompetenciaViewModel
                {
                    Tipo = 2, // Tipo 2 = Actualizar
                    IdAsignacion = id,
                    ValoracionJefe = request.Valoracion,
                    ComentariosJefe = request.Comentarios,
                    CalificacionFinal = request.CalificacionFinal,
                    FechaEvaluacionJefe = DateTime.Now,
                    Estado = "COMPLETADA"
                };

                var result = await Gestionar(model);
                var response = result.FirstOrDefault();

                if (response != null && response.valor1 > 0)
                {
                    return Ok(new { mensaje = "Evaluación del jefe registrada exitosamente" });
                }
                else
                {
                    return BadRequest(new { mensaje = response?.valor2 ?? "Error al registrar evaluación" });
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
                "PENDIENTE" => "Pendiente de Autoevaluación",
                "AUTOEVALUACION_COMPLETA" => "Autoevaluación Completa",
                "COMPLETADA" => "Evaluación Completa",
                "CANCELADA" => "Cancelada",
                _ => estado ?? "Sin Estado"
            };
        }

        private int CalcularDiferenciaEvaluacion(int? valoracionEmpleado, int? valoracionJefe)
        {
            if (!valoracionEmpleado.HasValue || !valoracionJefe.HasValue)
                return 0;

            return Math.Abs(valoracionEmpleado.Value - valoracionJefe.Value);
        }

        private bool TieneDiscrepancia(int? valoracionEmpleado, int? valoracionJefe)
        {
            return CalcularDiferenciaEvaluacion(valoracionEmpleado, valoracionJefe) >= 2; // Discrepancia si hay 2 o más puntos de diferencia
        }

        #endregion
    }

    // Clases auxiliares para requests
    public class AutoevaluacionRequest
    {
        public int Valoracion { get; set; }
        public string Comentarios { get; set; }
    }

    public class EvaluacionJefeRequest
    {
        public int Valoracion { get; set; }
        public string Comentarios { get; set; }
        public int CalificacionFinal { get; set; }
    }
}
