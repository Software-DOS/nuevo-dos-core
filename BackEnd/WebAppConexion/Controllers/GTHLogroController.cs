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
    public class GTHLogroController : ControllerBase
    {
        private readonly GTHLogroRepository _repository;

        public GTHLogroController(GTHLogroRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de logros según los filtros proporcionados.
        /// 1 = IdLogro, 2 = IdInfoProf, 3 = TipoLogro, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHLogroViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idLogro = null,
            [FromQuery] long? idInfoProf = null,
            [FromQuery] string tipoLogro = null)
        {
            // Convertimos long? a int? para el repositorio
            var entidades = await _repository.Mostrar(
                tipo,
                idLogro.HasValue ? (int?)idLogro.Value : null,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null,
                tipoLogro);

            var modelos = entidades.Select(e => new GTHLogroViewModel
            {
                Tipo = tipo,
                IdLogro = e.IdLogro,
                IdInfoProf = e.IdInfoProf,
                Titulo = e.Titulo,
                LogroTipo = e.LogroTipo,
                Descripcion = e.Descripcion,
                FechaLogro = e.FechaLogro,
                Evidencia = e.Evidencia
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de logro:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHLogroViewModel model)
        {
            // Mapear ViewModel a Entidad de Negocio
            var entidad = new GTHLogro
            {
                IdLogro = model.IdLogro,
                IdInfoProf = model.IdInfoProf,
                Titulo = model.Titulo,
                LogroTipo = model.LogroTipo,
                Descripcion = model.Descripcion,
                FechaLogro = model.FechaLogro,
                Evidencia = model.Evidencia
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
