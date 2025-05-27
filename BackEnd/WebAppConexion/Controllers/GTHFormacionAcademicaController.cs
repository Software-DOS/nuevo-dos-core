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
    public class GTHFormacionAcademicaController : ControllerBase
    {
        private readonly GTHFormacionAcademicaRepository _repository;

        public GTHFormacionAcademicaController(GTHFormacionAcademicaRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de formación académica según los filtros proporcionados.
        /// 1 = IdFormacion, 2 = IdInfoProf, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHFormacionAcademicaViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idFormacion = null,
            [FromQuery] long? idInfoProf = null)
        {
            // Ajustamos long? a int? para el repositorio
            var entidades = await _repository.Mostrar(
                tipo,
                idFormacion.HasValue ? (int?)idFormacion.Value : null,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null
            );

            var modelos = entidades.Select(e => new GTHFormacionAcademicaViewModel
            {
                Tipo = tipo,
                IdFormacion = e.IdFormacion,
                IdInfoProf = e.IdInfoProf,
                Institucion = e.Institucion,
                AnioInicio = e.AnioInicio,
                AnioGraduacion = e.AnioGraduacion,
                Especialidad = e.Especialidad,
                Promedio = e.Promedio,
                Descripcion = e.Descripcion,
                UltimaActualizacion = e.UltimaActualizacion
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de formación académica:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHFormacionAcademicaViewModel model)
        {
            var entidad = new GTHFormacionAcademica
            {
                IdFormacion = model.IdFormacion,
                IdInfoProf = model.IdInfoProf,
                Institucion = model.Institucion,
                AnioInicio = model.AnioInicio,
                AnioGraduacion = model.AnioGraduacion,
                Especialidad = model.Especialidad,
                Promedio = model.Promedio,
                Descripcion = model.Descripcion,
                UltimaActualizacion = model.UltimaActualizacion
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