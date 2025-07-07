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
    public class GTHCelulaController : ControllerBase
    {
        private readonly GTHCelulaRepository _repository;

        public GTHCelulaController(GTHCelulaRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de células según los filtros proporcionados.
        /// 1 = IdCelula, 2 = Nombre. 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHCelulaViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idCelula = null,
            [FromQuery] string nombre = null)
        {
            var entidades = await _repository.Mostrar(tipo, idCelula, nombre);

            var modelos = entidades.Select(e => new GTHCelulaViewModel
            {
                Tipo = tipo,
                IdCelula = e.IdCelula,
                Nombre = e.Nombre,
                Descripcion = e.Descripcion,
                Encargado = e.Encargado
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de célula:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHCelulaViewModel model)
        {
            var entidad = new GTHCelula
            {
                IdCelula = model.IdCelula,
                Nombre = model.Nombre,
                Descripcion = model.Descripcion,
                Encargado = model.Encargado
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
