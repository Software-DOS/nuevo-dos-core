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
    public class GTHHabInfoController : ControllerBase
    {
        private readonly GTHHabInfoRepository _repository;

        public GTHHabInfoController(GTHHabInfoRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve las asociaciones habilidad ↔ información profesional según filtros.
        /// 1 = IdHabilidad, 2 = IdInfoProf, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHHabInfoViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idHabilidad = null,
            [FromQuery] long? idInfoProf = null)
        {
            var entidades = await _repository.Mostrar(
                tipo,
                idHabilidad.HasValue ? (int?)idHabilidad.Value : null,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null
            );

            var modelos = entidades.Select(e => new GTHHabInfoViewModel
            {
                Tipo = tipo,
                IdHabilidad = e.IdHabilidad,
                IdInfoProf = e.IdInfoProf
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de asociación habilidad ↔ información profesional:
        /// 0 = Insertar, 2 = Eliminar. en esta caso, el editar que es 1 mo valdra ya que son FK los atributos
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHHabInfoViewModel model)
        {
            var entidad = new GTHHabInfo
            {
                IdHabilidad = model.IdHabilidad,
                IdInfoProf = model.IdInfoProf
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