using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GTHExperienciaLaboralController : ControllerBase
    {
        private readonly GTHExperienciaLaboralRepository _repository;

        public GTHExperienciaLaboralController(GTHExperienciaLaboralRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de experiencias laborales según los filtros proporcionados.
        /// 1 = IdExperiencia, 2 = IdInfoProf, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHExperienciaLaboralViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idExperiencia = null,
            [FromQuery] long? idInfoProf = null)
        {
            // Ajustar tipos a los parámetros esperados por el repositorio
            var entidades = await _repository.Mostrar(
                tipo,
                idExperiencia.HasValue ? (int?)idExperiencia.Value : null,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null
            );

            var modelos = entidades.Select(e => new GTHExperienciaLaboralViewModel
            {
                Tipo = tipo,
                IdExperiencia = e.IdExperiencia,
                IdInfoProf = e.IdInfoProf,
                Empresa = e.Empresa,
                Cargo = e.Cargo,
                FechaInicio = e.FechaInicio,
                FechaFin = e.FechaFin,
                Descripcion = e.Descripcion
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de experiencia laboral:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHExperienciaLaboralViewModel model)
        {
            var entidad = new GTHExperienciaLaboral
            {
                IdExperiencia = model.IdExperiencia,
                IdInfoProf = model.IdInfoProf,
                Empresa = model.Empresa,
                Cargo = model.Cargo,
                FechaInicio = model.FechaInicio,
                FechaFin = model.FechaFin,
                Descripcion = model.Descripcion
            };

            var resultado = await _repository.Gestionar(model.Tipo, entidad);
            return Ok(resultado.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
