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
    public class GTHNivelCompetenciaController : Controller
    {
        private readonly GTHNivelCompetenciaRepository _repository;
        private readonly IConfiguration _config;
        
        public GTHNivelCompetenciaController(GTHNivelCompetenciaRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de niveles de competencia según los filtros proporcionados.
        /// Tipos: 0=Todos, 1=Por ID, 2=Por Estado, 3=Por Competencia
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHNivelCompetenciaViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idNivel = null,
            [FromQuery] string estado = null,
            [FromQuery] int? idCompetencia = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idNivel, estado, idCompetencia);

            // Mapear cada GTHNivelCompetencia a su ViewModel
            return entidades.Select(e => new GTHNivelCompetenciaViewModel
            {
                IdNivelCompetencia = e.IdNivelCompetencia,
                IdCompetencia = e.IdCompetencia,
                Nivel = e.Nivel,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de nivel de competencia:
        /// 1 = Insertar, 2 = Actualizar, 3 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHNivelCompetenciaViewModel model)
        {
            // Mapear ViewModel a la entidad GTHNivelCompetencia
            var db = new GTHNivelCompetencia
            {
                Tipo = model.Tipo,
                IdNivelCompetencia = model.IdNivelCompetencia,
                IdCompetencia = model.IdCompetencia,
                Nivel = model.Nivel,
                Descripcion = model.Descripcion,
                Estado = model.Estado ?? "ACTIVO",
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
        /// Obtiene un nivel de competencia específico por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { mensaje = "ID de nivel de competencia inválido" });
                }

                // Usar tipo 1 para búsqueda por ID
                var niveles = await _repository.Mostrar(1, id);
                var nivel = niveles.FirstOrDefault();

                if (nivel == null)
                {
                    return NotFound(new { mensaje = "No se encontró el nivel de competencia especificado" });
                }

                // Mapear a ViewModel
                var viewModel = new GTHNivelCompetenciaViewModel
                {
                    IdNivelCompetencia = nivel.IdNivelCompetencia,
                    IdCompetencia = nivel.IdCompetencia,
                    Nivel = nivel.Nivel,
                    Descripcion = nivel.Descripcion,
                    Estado = nivel.Estado,
                    FechaCreacion = nivel.FechaCreacion
                };

                return Ok(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todos los niveles de una competencia específica.
        /// </summary>
        [HttpGet("competencia/{idCompetencia}")]
        public async Task<IEnumerable<GTHNivelCompetenciaViewModel>> ObtenerPorCompetencia(int idCompetencia)
        {
            // Usar tipo 3 para búsqueda por competencia
            var entidades = await _repository.Mostrar(3, null, null, idCompetencia);

            return entidades.Select(e => new GTHNivelCompetenciaViewModel
            {
                IdNivelCompetencia = e.IdNivelCompetencia,
                IdCompetencia = e.IdCompetencia,
                Nivel = e.Nivel,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion
            }).OrderBy(x => x.Nivel); // Ordenar por nivel
        }

        /// <summary>
        /// Obtiene todos los niveles activos.
        /// </summary>
        [HttpGet("activos")]
        public async Task<IEnumerable<GTHNivelCompetenciaViewModel>> ObtenerActivos()
        {
            // Usar tipo 2 para búsqueda por estado ACTIVO
            var entidades = await _repository.Mostrar(2, null, "ACTIVO");

            return entidades.Select(e => new GTHNivelCompetenciaViewModel
            {
                IdNivelCompetencia = e.IdNivelCompetencia,
                IdCompetencia = e.IdCompetencia,
                Nivel = e.Nivel,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion
            }).OrderBy(x => x.IdCompetencia).ThenBy(x => x.Nivel);
        }

        #region Métodos auxiliares

        private string ObtenerDescripcionNivel(int nivel)
        {
            return nivel switch
            {
                1 => "Básico",
                2 => "Intermedio",
                3 => "Avanzado",
                4 => "Experto",
                5 => "Maestro",
                _ => $"Nivel {nivel}"
            };
        }

        #endregion
    }
}
