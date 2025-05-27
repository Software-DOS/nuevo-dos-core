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
    public class GTHHabilidadesController : ControllerBase
    {
        private readonly GTHHabilidadesRepository _repository;

        public GTHHabilidadesController(GTHHabilidadesRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de habilidades según los filtros proporcionados.
        /// 1 = IdHabilidad, 2 = Nombre, 3 = Categoria, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHHabilidadesViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idHabilidad = null,
            [FromQuery] string nombre = null,
            [FromQuery] string categoria = null)
        {
            // Convertir long? a int? para el repositorio
            var entidades = await _repository.Mostrar(
                tipo,
                idHabilidad.HasValue ? (int?)idHabilidad.Value : null,
                nombre,
                categoria);

            var modelos = entidades.Select(e => new GTHHabilidadesViewModel
            {
                Tipo = tipo,
                IdHabilidad = e.IdHabilidad,
                Nombre = e.Nombre,
                Categoria = e.Categoria,
                Descripcion = e.Descripcion
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de habilidad:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHHabilidadesViewModel model)
        {
            var entidad = new GTHHabilidades
            {
                IdHabilidad = model.IdHabilidad,
                Nombre = model.Nombre,
                Categoria = model.Categoria,
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
