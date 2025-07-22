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
    public class GTHAsignacionCapacitacionController : ControllerBase
    {
        private readonly GTHAsignacionCapacitacionRepository _repository;
        private readonly GTHEmpleadoRepository _empleadoRepository;
        private readonly GTHCapacitacionRepository _capacitacionRepository;

        public GTHAsignacionCapacitacionController(
            GTHAsignacionCapacitacionRepository repository,
            GTHEmpleadoRepository empleadoRepository,
            GTHCapacitacionRepository capacitacionRepository)
        {
            _repository = repository;
            _empleadoRepository = empleadoRepository;
            _capacitacionRepository = capacitacionRepository;
        }
        /// <summary>
        /// Devuelve la lista de asignaciones de capacitación EN CURSO con información detallada del empleado y la capacitación.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHAsignacionCapacitacionDetalladaViewModel>>> MostrarDetalladaEnCurso(
            [FromQuery] int tipo = 0,
            [FromQuery] int? idCapacitacion = null,
            [FromQuery] int? idEmpleado = null,
            [FromQuery] string cedulaEmpleado = null)
        {
            // Obtener las asignaciones
            var asignaciones = await _repository.Mostrar(tipo, idCapacitacion, idEmpleado, cedulaEmpleado);

            var resultado = new List<GTHAsignacionCapacitacionDetalladaViewModel>();

            foreach (var asignacion in asignaciones)
            {
                // Obtener información de la capacitación (tipo 1 = por ID)
                var capacitaciones = await _capacitacionRepository.Mostrar(1, (int)asignacion.IdCapacitacion);
                var capacitacion = capacitaciones.FirstOrDefault();

                // Si no existe la capacitación, igual se agrega el registro (puedes cambiar esto si quieres filtrar solo los que tengan capacitación)

                // Obtener información del empleado (tipo 1 = por ID)
                var empleados = await _empleadoRepository.Mostrar(1, (int)asignacion.IdEmpleado);
                var empleado = empleados.FirstOrDefault();

                var detallada = new GTHAsignacionCapacitacionDetalladaViewModel
                {
                    IdAsignacion = asignacion.IdEmpleado, // Temporal, si hay un ID único usarlo
                    IdCapacitacion = asignacion.IdCapacitacion,
                    IdEmpleado = asignacion.IdEmpleado,
                    CedulaEmpleado = asignacion.CedulaEmpleado,
                    Fecha = asignacion.Fecha,
                    Progreso = asignacion.Progreso,
                    Empleado = empleado != null ? new WebAppConexion.Models.EmpleadoInfo
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
                    Capacitacion = capacitacion != null ? new WebAppConexion.Models.CapacitacionInfo
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
                resultado.Add(detallada);
            }

            return Ok(resultado);
        }

        /// <summary>
        /// Devuelve la lista de asignaciones de capacitación según los filtros proporcionados.
        /// 1 = IdCapacitacion, 2 = IdEmpleado, 3 = CedulaEmpleado, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<GTHAsignacionCapacitacionViewModel>>> Mostrar(
            [FromQuery] int tipo,
            [FromQuery] int? idCapacitacion = null,
            [FromQuery] int? idEmpleado = null,
            [FromQuery] string cedulaEmpleado = null)
        {
            var entidades = await _repository.Mostrar(tipo, idCapacitacion, idEmpleado, cedulaEmpleado);

            var modelos = entidades.Select(e => new GTHAsignacionCapacitacionViewModel
            {
                Tipo = e.Tipo,
                IdCapacitacion = e.IdCapacitacion,
                IdEmpleado = e.IdEmpleado,
                CedulaEmpleado = e.CedulaEmpleado,
                Fecha = e.Fecha,
                Progreso = e.Progreso
            });

            return Ok(modelos);
        }

        /// <summary>
        /// Ejecuta la operación de gestión de asignación de capacitación:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<Generica>>> Gestionar(
            [FromBody] GTHAsignacionCapacitacionViewModel model)
        {
            // Mapear ViewModel a Entidad
            var entidad = new GTHAsignacionCapacitacion
            {
                // Aquí sí dependemos de que tu ViewModel incluya la propiedad Tipo
                Tipo = model.Tipo,
                IdCapacitacion = model.IdCapacitacion,
                IdEmpleado = model.IdEmpleado,
                CedulaEmpleado = model.CedulaEmpleado,
                Fecha = model.Fecha,
                Progreso = model.Progreso
            };

            // Llamamos a Gestionar pasándole model.Tipo y la cédula
            var response = await _repository.Gestionar(entidad.Tipo, entidad, model.CedulaEmpleado);

            // Mapeamos de Generica a Generica (solo para replicar el patrón de Empleado)
            return Ok(response.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
