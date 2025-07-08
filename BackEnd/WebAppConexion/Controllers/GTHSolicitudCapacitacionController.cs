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
    public class GTHSolicitudCapacitacionController : ControllerBase
    {
        private readonly GTHSolicitudCapacitacionRepository _repository;

        public GTHSolicitudCapacitacionController(GTHSolicitudCapacitacionRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Devuelve la lista de solicitudes de capacitación según los filtros proporcionados.
        /// 1 = IdCapacitacion, 2 = IdEmpleado, 3 = CedulaEmpleado, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHSolicitudCapacitacionViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] long? idCapacitacion = null,
            [FromQuery] long? idEmpleado = null,
            [FromQuery] string cedulaEmpleado = null)
        {
            var entidades = await _repository.Mostrar(
                tipo,
                idCapacitacion.HasValue ? (int?)idCapacitacion.Value : null,
                idEmpleado.HasValue ? (int?)idEmpleado.Value : null,
                cedulaEmpleado
            );

            var modelos = entidades.Select(e => new GTHSolicitudCapacitacionViewModel
            {
                Tipo = tipo,
                IdCapacitacion = e.IdCapacitacion,
                IdEmpleado = e.IdEmpleado,
                Justificacion = e.Justificacion,
                FechaSolicitud = e.FechaSolicitud,
                Respuesta = e.Respuesta,
                FechaRespuesta = e.FechaRespuesta
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de solicitud de capacitación:
        /// 1 = Insertar, 2 = Editar, 3 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHSolicitudCapacitacionViewModel model)
        {
            // Validación: la justificación es obligatoria
            if (string.IsNullOrWhiteSpace(model.Justificacion))
            {
                return BadRequest("La justificación es obligatoria.");
            }

            // Mapear ViewModel a entidad
            var solicitud = new GTHSolicitudCapacitacion
            {
                IdCapacitacion = model.IdCapacitacion,
                IdEmpleado = model.IdEmpleado,
                Justificacion = model.Justificacion,
                FechaSolicitud = model.FechaSolicitud,
                Respuesta = model.Respuesta,
                FechaRespuesta = model.FechaRespuesta
            };

            var resultado = await _repository.Gestionar(model.Tipo, solicitud);
            return Ok(resultado.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
