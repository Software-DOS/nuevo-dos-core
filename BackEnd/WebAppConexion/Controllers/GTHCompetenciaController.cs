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
    public class GTHCompetenciaController : Controller
    {
        private readonly GTHCompetenciaRepository _repository;
        private readonly IConfiguration _config;
        
        public GTHCompetenciaController(GTHCompetenciaRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de competencias según los filtros proporcionados.
        /// Tipos: 0=Todas, 1=Por ID, 2=Por Estado, 3=Por Nombre
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHCompetenciaViewModel>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idCompetencia = null,
            [FromQuery] string estado = null,
            [FromQuery] string nombreCompetencia = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idCompetencia, estado, nombreCompetencia);

            // Mapear cada GTHCompetencia a su ViewModel
            return entidades.Select(e => new GTHCompetenciaViewModel
            {
                IdCompetencia = e.IdCompetencia,
                NombreCompetencia = e.NombreCompetencia,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion,
                UsuarioCreacion = e.UsuarioCreacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de competencia:
        /// 1 = Insertar, 2 = Actualizar, 3 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHCompetenciaViewModel model)
        {
            // Mapear ViewModel a la entidad GTHCompetencia
            var db = new GTHCompetencia
            {
                Tipo = model.Tipo,
                IdCompetencia = model.IdCompetencia,
                NombreCompetencia = model.NombreCompetencia,
                Descripcion = model.Descripcion,
                Estado = model.Estado ?? "ACTIVO",
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
        /// Obtiene una competencia específica por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new { mensaje = "ID de competencia inválido" });
                }

                // Usar tipo 1 para búsqueda por ID
                var competencias = await _repository.Mostrar(1, id);
                var competencia = competencias.FirstOrDefault();

                if (competencia == null)
                {
                    return NotFound(new { mensaje = "No se encontró la competencia especificada" });
                }

                // Mapear a ViewModel
                var viewModel = new GTHCompetenciaViewModel
                {
                    IdCompetencia = competencia.IdCompetencia,
                    NombreCompetencia = competencia.NombreCompetencia,
                    Descripcion = competencia.Descripcion,
                    Estado = competencia.Estado,
                    FechaCreacion = competencia.FechaCreacion,
                    FechaModificacion = competencia.FechaModificacion,
                    UsuarioCreacion = competencia.UsuarioCreacion
                };

                return Ok(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene todas las competencias activas.
        /// </summary>
        [HttpGet("activas")]
        public async Task<IEnumerable<GTHCompetenciaViewModel>> ObtenerActivas()
        {
            // Usar tipo 2 para búsqueda por estado ACTIVO
            var entidades = await _repository.Mostrar(2, null, "ACTIVO");

            return entidades.Select(e => new GTHCompetenciaViewModel
            {
                IdCompetencia = e.IdCompetencia,
                NombreCompetencia = e.NombreCompetencia,
                Descripcion = e.Descripcion,
                Estado = e.Estado,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion,
                UsuarioCreacion = e.UsuarioCreacion
            });
        }
    }
}
