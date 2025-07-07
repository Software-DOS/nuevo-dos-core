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
    public class GTHIdiomaController : ControllerBase
    {
        private readonly GTHIdiomaRepository _repository;

        public GTHIdiomaController(GTHIdiomaRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de idiomas según los filtros proporcionados.
        /// 1 = IdIdioma, 2 = Nombre, 3 = Nivel, 4 = NivelEspecifico, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHIdiomaViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idIdioma = null,
            [FromQuery] string nombre = null,
            [FromQuery] string nivel = null,
            [FromQuery] string nivelEspecifico = null)
        {
            // Convertir long? a int? para el repositorio
            var entidades = await _repository.Mostrar(
                tipo,
                idIdioma.HasValue ? (int?)idIdioma.Value : null,
                nombre,
                nivel,
                nivelEspecifico);

            var modelos = entidades.Select(e => new GTHIdiomaViewModel
            {
                Tipo = tipo,
                IdIdioma = e.IdIdioma,
                Nombre = e.Nombre,
                Descripcion = e.Descripcion,
                Nivel = e.Nivel,
                NivelEspecifico = e.NivelEspecifico
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de idioma:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHIdiomaViewModel model)
        {
            var entidad = new GTHIdioma
            {
                IdIdioma = model.IdIdioma,
                Nombre = model.Nombre,
                Descripcion = model.Descripcion,
                Nivel = model.Nivel,
                NivelEspecifico = model.NivelEspecifico
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
