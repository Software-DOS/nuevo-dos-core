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
    public class GTHEntidadCapacitacionController : ControllerBase
    {
        private readonly GTHEntidadCapacitacionRepository _repository;

        public GTHEntidadCapacitacionController(GTHEntidadCapacitacionRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de entidades de capacitación según los filtros proporcionados.
        /// 1 = IdEntidadCap, 2 = Nombre, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHEntidadCapacitacionViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idEntidadCap = null,
            [FromQuery] string nombre = null)
        {
            var entidades = await _repository.Mostrar(tipo, idEntidadCap, nombre);

            var modelos = entidades.Select(e => new GTHEntidadCapacitacionViewModel
            {
                Tipo = tipo,
                IdEntidadCap = e.IdEntidadCap,
                Nombre = e.Nombre,
                Pagina = e.Pagina,
                InfoContacto = e.InfoContacto,
                Descripcion = e.Descripcion
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de entidad de capacitación:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHEntidadCapacitacionViewModel model)
        {
            var entidad = new GTHEntidadCapacitacion
            {
                IdEntidadCap = model.IdEntidadCap,
                Nombre = model.Nombre,
                Pagina = model.Pagina,
                InfoContacto = model.InfoContacto,
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