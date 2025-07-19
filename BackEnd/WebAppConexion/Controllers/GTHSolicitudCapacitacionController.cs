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
        private readonly GTHEmpleadoRepository _empleadoRepository;
        private readonly GTHCapacitacionRepository _capacitacionRepository;

        public GTHSolicitudCapacitacionController(
            GTHSolicitudCapacitacionRepository repository,
            GTHEmpleadoRepository empleadoRepository,
            GTHCapacitacionRepository capacitacionRepository)
        {
            _repository = repository;
            _empleadoRepository = empleadoRepository;
            _capacitacionRepository = capacitacionRepository;
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
                CedulaEmpleado = e.CedulaEmpleado,
                Justificacion = e.Justificacion,
                FechaSolicitud = e.FechaSolicitud,
                Respuesta = e.Respuesta,
                FechaRespuesta = e.FechaRespuesta
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Devuelve la lista de solicitudes de capacitación con información detallada del empleado y la capacitación.
        /// 1 = IdCapacitacion, 2 = IdEmpleado, 3 = CedulaEmpleado, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHSolicitudCapacitacionDetalladaViewModel>>> MostrarDetallada(
            [FromQuery] int tipo,
            [FromQuery] long? idCapacitacion = null,
            [FromQuery] long? idEmpleado = null,
            [FromQuery] string cedulaEmpleado = null)
        {
            // Obtener las solicitudes
            var solicitudes = await _repository.Mostrar(
                tipo,
                idCapacitacion.HasValue ? (int?)idCapacitacion.Value : null,
                idEmpleado.HasValue ? (int?)idEmpleado.Value : null,
                cedulaEmpleado
            );

            var solicitudesDetalladas = new List<GTHSolicitudCapacitacionDetalladaViewModel>();

            foreach (var solicitud in solicitudes)
            {
                // Obtener información del empleado (tipo 1 = por ID)
                var empleados = await _empleadoRepository.Mostrar(1, (int)solicitud.IdEmpleado);
                var empleado = empleados.FirstOrDefault();

                // Obtener información de la capacitación (tipo 1 = por ID)
                var capacitaciones = await _capacitacionRepository.Mostrar(1, (int)solicitud.IdCapacitacion);
                var capacitacion = capacitaciones.FirstOrDefault();

                var solicitudDetallada = new GTHSolicitudCapacitacionDetalladaViewModel
                {
                    IdSolicitud = solicitud.IdEmpleado, // Usando como identificador único temporalmente
                    IdCapacitacion = solicitud.IdCapacitacion,
                    IdEmpleado = solicitud.IdEmpleado,
                    CedulaEmpleado = solicitud.CedulaEmpleado,
                    Justificacion = solicitud.Justificacion,
                    FechaSolicitud = solicitud.FechaSolicitud,
                    Respuesta = solicitud.Respuesta,
                    FechaRespuesta = solicitud.FechaRespuesta,

                    Empleado = empleado != null ? new EmpleadoInfo
                    {
                        IdEmpleado = empleado.IdEmpleado,
                        Cedula = empleado.Cedula,
                        Nombre = empleado.Nombre,
                        Apellido = empleado.Apellido,
                        Correo = empleado.Correo,
                        CorreoCorporativo = empleado.CorreoCorporativo,
                        Telefono = empleado.Telefono,
                        CargoActual = empleado.CargoActual,
                        Area = empleado.Area,
                        EstadoEmpleado = empleado.EstadoEmpleado
                    } : null,

                    Capacitacion = capacitacion != null ? new CapacitacionInfo
                    {
                        IdCapacitacion = capacitacion.IdCapacitacion,
                        Nombre = capacitacion.Nombre,
                        Titulo = capacitacion.Titulo,
                        Categoria = capacitacion.Categoria,
                        Descripcion = capacitacion.Descripcion,
                        Estado = capacitacion.Estado,
                        FechaInicio = capacitacion.FechaInicio,
                        FechaFin = capacitacion.FechaFin,
                        Duracion = capacitacion.Duracion,
                        Costo = capacitacion.Costo,
                        Modalidad = capacitacion.Modalidad,
                        Observaciones = capacitacion.Observaciones
                    } : null
                };

                solicitudesDetalladas.Add(solicitudDetallada);
            }

            return Ok(solicitudesDetalladas);
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
                CedulaEmpleado = model.CedulaEmpleado,
                Justificacion = model.Justificacion,
                FechaSolicitud = model.FechaSolicitud,
                Respuesta = model.Respuesta,
                FechaRespuesta = model.FechaRespuesta
            };

            var resultado = await _repository.Gestionar(model.Tipo, solicitud, model.CedulaEmpleado);
            return Ok(resultado.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
