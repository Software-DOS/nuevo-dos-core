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
    public class GTHInformacionProfesionalController : ControllerBase
    {
        private readonly GTHInformacionProfesionalRepository _repository;

        public GTHInformacionProfesionalController(GTHInformacionProfesionalRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de información profesional según los filtros proporcionados.
        /// 1 = IdInfoProf, 2 = IdEmpleado, 3 = CedulaEmpleado, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHInformacionProfesionalViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idInfoProf = null,
            [FromQuery] long? idEmpleado = null,
            [FromQuery] string cedulaEmpleado = null)
        {
            var entidades = await _repository.Mostrar(
                tipo,
                idInfoProf.HasValue ? (int?)idInfoProf.Value : null,
                idEmpleado.HasValue ? (int?)idEmpleado.Value : null,
                cedulaEmpleado
            );

            var modelos = entidades.Select(e => new GTHInformacionProfesionalViewModel
            {
                Tipo = tipo,
                IdInfoProf = e.IdInfoProf,
                IdEmpleado = e.IdEmpleado,
                DescripcionProfesional = e.DescripcionProfesional,
                PerfilLinkedIn = e.PerfilLinkedIn,
                FechaCreacion = e.FechaCreacion
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de información profesional:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHInformacionProfesionalViewModel model)
        {
            var entidad = new GTHInformacionProfesional
            {
                IdInfoProf = model.IdInfoProf,
                IdEmpleado = model.IdEmpleado,
                DescripcionProfesional = model.DescripcionProfesional,
                PerfilLinkedIn = model.PerfilLinkedIn,
                FechaCreacion = model.FechaCreacion
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
