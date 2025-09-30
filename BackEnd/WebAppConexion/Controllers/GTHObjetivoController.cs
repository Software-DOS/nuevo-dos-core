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
    public class GTHObjetivoController : Controller
    {
        private readonly GTHObjetivoRepository _repository;
        private readonly IConfiguration _config;
        
        public GTHObjetivoController(GTHObjetivoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de objetivos según los filtros proporcionados.
        /// Tipos: 0=Todos, 1=Por ID, 2=Por Evaluación, 3=Por Estado
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHObjetivoViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idObjetivo = null,
            [FromQuery] int? idEvaluacion = null,
            [FromQuery] string estado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idObjetivo, idEvaluacion, estado);

            // Mapear cada GTHObjetivo a su ViewModel
            return entidades.Select(e => new GTHObjetivoViewModel
            {
                IdObjetivo = e.IdObjetivo,
                IdEvaluacion = e.IdEvaluacion,
                Titulo = e.Titulo,
                Descripcion = e.Descripcion,
                TipoObjetivo = e.TipoObjetivo,
                Peso = e.Peso,
                ValoracionEmpleado = e.ValoracionEmpleado,
                ValoracionJefe = e.ValoracionJefe,
                CalificacionEmpleado = e.CalificacionEmpleado,
                CalificacionFinal = e.CalificacionFinal,
                FechaLimite = e.FechaLimite,
                ComentariosEmpleado = e.ComentariosEmpleado,
                ComentariosJefe = e.ComentariosJefe,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de objetivo:
        /// 1 = Insertar, 2 = Actualizar, 3 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHObjetivoViewModel model)
        {
            // Mapear ViewModel a la entidad GTHObjetivo
            var db = new GTHObjetivo
            {
                Tipo = model.Tipo,
                IdObjetivo = model.IdObjetivo,
                IdEvaluacion = model.IdEvaluacion,
                Titulo = model.Titulo,
                Descripcion = model.Descripcion,
                TipoObjetivo = model.TipoObjetivo ?? "INDIVIDUAL",
                Peso = model.Peso ?? 1.00m,
                ValoracionEmpleado = model.ValoracionEmpleado,
                ValoracionJefe = model.ValoracionJefe,
                CalificacionEmpleado = model.CalificacionEmpleado,
                CalificacionFinal = model.CalificacionFinal,
                FechaLimite = model.FechaLimite,                
                ComentariosEmpleado = model.ComentariosEmpleado,
                ComentariosJefe = model.ComentariosJefe,
                Estado = model.Estado ?? "ACTIVO",
                FechaCreacion = model.FechaCreacion,
                FechaModificacion = model.FechaModificacion
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
        /// Obtiene un objetivo específico por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { mensaje = "ID de objetivo inválido" });
                }

                // Usar tipo 1 para búsqueda por ID
                var objetivos = await _repository.Mostrar(1, id);
                var objetivo = objetivos.FirstOrDefault();

                if (objetivo == null)
                {
                    return NotFound(new { mensaje = "No se encontró el objetivo especificado" });
                }

                // Mapear a ViewModel
                var viewModel = new GTHObjetivoViewModel
                {
                    IdObjetivo = objetivo.IdObjetivo,
                    IdEvaluacion = objetivo.IdEvaluacion,
                    Titulo = objetivo.Titulo,
                    Descripcion = objetivo.Descripcion,
                    TipoObjetivo = objetivo.TipoObjetivo,
                    Peso = objetivo.Peso,
                    ValoracionEmpleado = objetivo.ValoracionEmpleado,
                    ValoracionJefe = objetivo.ValoracionJefe,
                    CalificacionEmpleado = objetivo.CalificacionEmpleado,
                    CalificacionFinal = objetivo.CalificacionFinal,
                    FechaLimite = objetivo.FechaLimite,
                    ComentariosEmpleado = objetivo.ComentariosEmpleado,
                    ComentariosJefe = objetivo.ComentariosJefe,
                    Estado = objetivo.Estado,
                    FechaCreacion = objetivo.FechaCreacion,
                    FechaModificacion = objetivo.FechaModificacion
                };

                return Ok(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todos los objetivos de una evaluación específica.
        /// </summary>
        [HttpGet("evaluacion/{idEvaluacion}")]
        public async Task<IEnumerable<GTHObjetivoViewModel>> ObtenerPorEvaluacion(int idEvaluacion)
        {
            // Usar tipo 2 para búsqueda por evaluación
            var entidades = await _repository.Mostrar(2, null, idEvaluacion);

            return entidades.Select(e => new GTHObjetivoViewModel
            {
                IdObjetivo = e.IdObjetivo,
                IdEvaluacion = e.IdEvaluacion,
                Titulo = e.Titulo,
                Descripcion = e.Descripcion,
                TipoObjetivo = e.TipoObjetivo,
                Peso = e.Peso,
                ValoracionEmpleado = e.ValoracionEmpleado,
                ValoracionJefe = e.ValoracionJefe,
                CalificacionEmpleado = e.CalificacionEmpleado,
                CalificacionFinal = e.CalificacionFinal,
                FechaLimite = e.FechaLimite,
                ComentariosEmpleado = e.ComentariosEmpleado,
                ComentariosJefe = e.ComentariosJefe,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion
            }).OrderBy(x => x.TipoObjetivo).ThenBy(x => x.Titulo);
        }

        /// <summary>
        /// Registra la autoevaluación de un objetivo.
        /// </summary>
        [HttpPut("{id}/autoevaluacion")]
        public async Task<IActionResult> RegistrarAutoevaluacion(int id, [FromBody] AutoevaluacionObjetivoRequest request)
        {
            try
            {
                var model = new GTHObjetivoViewModel
                {
                    Tipo = 2, // Tipo 2 = Actualizar
                    IdObjetivo = id,
                    ValoracionEmpleado = request.Valoracion,
                    ComentariosEmpleado = request.Comentarios,
                    Estado = "AUTOEVALUACION_COMPLETA"
                };

                var result = await Gestionar(model);
                var response = result.FirstOrDefault();

                if (response != null && response.valor1 > 0)
                {
                    return Ok(new { mensaje = "Autoevaluación de objetivo registrada exitosamente" });
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
        /// Registra la evaluación del jefe para un objetivo.
        /// </summary>
        [HttpPut("{id}/evaluacion-jefe")]
        public async Task<IActionResult> RegistrarEvaluacionJefe(int id, [FromBody] EvaluacionObjetivoJefeRequest request)
        {
            try
            {
                var model = new GTHObjetivoViewModel
                {
                    Tipo = 2, // Tipo 2 = Actualizar
                    IdObjetivo = id,
                    ValoracionJefe = request.Valoracion,
                    ComentariosJefe = request.Comentarios,
                    CalificacionFinal = request.CalificacionFinal,
                    Estado = "COMPLETADO"
                };

                var result = await Gestionar(model);
                var response = result.FirstOrDefault();

                if (response != null && response.valor1 > 0)
                {
                    return Ok(new { mensaje = "Evaluación de objetivo por jefe registrada exitosamente" });
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

        private string ObtenerDescripcionTipoObjetivo(string tipoObjetivo)
        {
            return tipoObjetivo switch
            {
                "INDIVIDUAL" => "Objetivo Individual",
                "DEPARTAMENTAL" => "Objetivo Departamental",
                "ORGANIZACIONAL" => "Objetivo Organizacional",
                "PROYECTO" => "Objetivo de Proyecto",
                "DESARROLLO" => "Objetivo de Desarrollo",
                _ => "Objetivo General"
            };
        }

        private string ObtenerDescripcionEstado(string estado)
        {
            return estado switch
            {
                "PENDIENTE" => "Pendiente de Autoevaluación",
                "AUTOEVALUACION_COMPLETA" => "Autoevaluación Completa",
                "COMPLETADO" => "Objetivo Completado",
                "CANCELADO" => "Objetivo Cancelado",
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

    // Clases auxiliares para requests de objetivos
    public class AutoevaluacionObjetivoRequest
    {
        public int Valoracion { get; set; }
        public string Comentarios { get; set; }
    }

    public class EvaluacionObjetivoJefeRequest
    {
        public int Valoracion { get; set; }
        public string Comentarios { get; set; }
        public int CalificacionFinal { get; set; }
    }
}
