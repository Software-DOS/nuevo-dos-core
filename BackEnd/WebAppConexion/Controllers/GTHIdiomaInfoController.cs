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
    public class GTHIdiomaInfoController : ControllerBase
    {
        private readonly GTHIdiomaInfoRepository _repository;

        public GTHIdiomaInfoController(GTHIdiomaInfoRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve las asociaciones idioma ↔ información profesional según filtros.
        /// 1 = IdInfoProf, 2 = IdIdioma. 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHIdiomaInfoViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idInfoProf = null,
            [FromQuery] long? idIdioma = null)
        {
            var entidades = await _repository.Mostrar(
                tipo,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null,
                idIdioma.HasValue ? (int?)idIdioma.Value : null
            );

            var modelos = entidades.Select(e => new GTHIdiomaInfoViewModel
            {
                Tipo = tipo,
                IdInfoProf = e.IdInfoProf,
                IdIdioma = e.IdIdioma
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de la asociación idioma ↔ información profesional:
        /// 0 = Insertar, 2 = Eliminar. en esta caso, el editar que es 1 mo valdra ya que son FK los atributos
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHIdiomaInfoViewModel model)
        {
            var entidad = new GTHIdiomaInfo
            {
                IdInfoProf = model.IdInfoProf,
                IdIdioma = model.IdIdioma
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
