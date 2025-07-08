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

        public GTHAsignacionCapacitacionController(GTHAsignacionCapacitacionRepository repository)
        {
            _repository = repository;
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
                Fecha = model.Fecha,
                Progreso = model.Progreso
            };

            // Llamamos a Gestionar pasándole model.Tipo (igual que en Empleado)
            var response = await _repository.Gestionar(entidad.Tipo, entidad);

            // Mapeamos de Generica a Generica (solo para replicar el patrón de Empleado)
            return Ok(response.Select(r => new Generica
            {
                valor1 = r.valor1,
                valor2 = r.valor2
            }));
        }
    }
}
