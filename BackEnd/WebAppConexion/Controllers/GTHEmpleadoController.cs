using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppConexion.Models;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class GTHEmpleadoController : Controller
    {
        private readonly GTHEmpleadoRepository _repository;
        private readonly IConfiguration _config;
        public GTHEmpleadoController(GTHEmpleadoRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        /// <summary>
        /// Devuelve la lista de empleados según los filtros proporcionados.
        /// 1 = IdEmpleado/Cédula, 2 = IdCelula, 3 = EstadoEmpleado, 4 = Cédula exclusiva, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHEmpleadoViewModel>> Mostrar(
        [FromQuery] int tipo,
        [FromQuery] int? idEmpleado = null,
        [FromQuery] int? idCelula = null,
        [FromQuery] string estadoEmpleado = null,
        [FromQuery] string cedulaEmpleado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idEmpleado, idCelula, estadoEmpleado, cedulaEmpleado);

            // Mapear cada GTHEmpleado a tu ViewModel
            return entidades.Select(e => new GTHEmpleadoViewModel
            {
                Tipo = e.Tipo,
                IdEmpleado = e.IdEmpleado,
                IdPerfil = e.IdPerfil,
                IdCelula = e.IdCelula,
                Cedula = e.Cedula,
                Nombre = e.Nombre,
                Apellido = e.Apellido,
                FechaNacimiento = e.FechaNacimiento,
                Direccion = e.Direccion,
                Telefono = e.Telefono,
                Correo = e.Correo,
                CorreoCorporativo = e.CorreoCorporativo,
                FechaContratacion = e.FechaContratacion,
                EstadoCivil = e.EstadoCivil,
                Sexo = e.Sexo,
                FotoPerfilUrl = e.FotoPerfilUrl,
                EstadoEmpleado = e.EstadoEmpleado,
                EmpTipo = e.EmpTipo,
                ActPassword = e.ActPassword,
                Password = e.Password,
                Sueldo = e.Sueldo,
                
                // Nuevos campos añadidos
                TipoSangre = e.TipoSangre,
                Etnia = e.Etnia,
                PaisNacimiento = e.PaisNacimiento,
                ProvinciaNacimiento = e.ProvinciaNacimiento,
                CiudadNacimiento = e.CiudadNacimiento,
                NivelEstudio = e.NivelEstudio,
                CargasFamiliares = e.CargasFamiliares,
                DocumentoIdentidad = e.DocumentoIdentidad,
                NombreEmergencia = e.NombreEmergencia,
                RelacionEmergencia = e.RelacionEmergencia,
                TelefonoEmergencia = e.TelefonoEmergencia,
                NombreConyuge = e.NombreConyuge,
                FechaMatrimonio = e.FechaMatrimonio,
                DiscapacidadConyuge = e.DiscapacidadConyuge,
                DocumentosConyuge = e.DocumentosConyuge,
                CargoActual = e.CargoActual,
                Area = e.Area,
                SubArea = e.SubArea,
                Empresa = e.Empresa,
                JefeDirecto = e.JefeDirecto,
                TipoContrato = e.TipoContrato,
                Ubicacion = e.Ubicacion
            });
        }

        /// <summary>
        /// Ejecuta la operación de gestión de empleado:
        /// 0 = Insertar, 1 = Editar, 2 = Eliminar.
        /// </summary>
        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Gestionar([FromBody] GTHEmpleadoViewModel model)
        {
            // Mapear ViewModel a la entidad GTHEmpleado
            var db = new GTHEmpleado
            {
                Tipo = model.Tipo,
                IdEmpleado = model.IdEmpleado,
                IdPerfil = model.IdPerfil,
                IdCelula = model.IdCelula,
                Cedula = model.Cedula,
                Nombre = model.Nombre,
                Apellido = model.Apellido,
                FechaNacimiento = model.FechaNacimiento,
                Direccion = model.Direccion,
                Telefono = model.Telefono,
                Correo = model.Correo?.ToLower(),
                CorreoCorporativo = model.CorreoCorporativo?.ToLower(),
                FechaContratacion = model.FechaContratacion,
                EstadoCivil = model.EstadoCivil,
                Sexo = model.Sexo,
                FotoPerfilUrl = model.FotoPerfilUrl,
                EstadoEmpleado = model.EstadoEmpleado,
                EmpTipo = model.EmpTipo,
                Sueldo = model.Sueldo,
                
                // Nuevos campos añadidos
                TipoSangre = model.TipoSangre,
                Etnia = model.Etnia,
                PaisNacimiento = model.PaisNacimiento,
                ProvinciaNacimiento = model.ProvinciaNacimiento,
                CiudadNacimiento = model.CiudadNacimiento,
                NivelEstudio = model.NivelEstudio,
                CargasFamiliares = model.CargasFamiliares,
                DocumentoIdentidad = model.DocumentoIdentidad,
                NombreEmergencia = model.NombreEmergencia,
                RelacionEmergencia = model.RelacionEmergencia,
                TelefonoEmergencia = model.TelefonoEmergencia,
                NombreConyuge = model.NombreConyuge,
                FechaMatrimonio = model.FechaMatrimonio,
                DiscapacidadConyuge = model.DiscapacidadConyuge,
                DocumentosConyuge = model.DocumentosConyuge,
                CargoActual = model.CargoActual,
                Area = model.Area,
                SubArea = model.SubArea,
                Empresa = model.Empresa,
                JefeDirecto = model.JefeDirecto,
                TipoContrato = model.TipoContrato,
                Ubicacion = model.Ubicacion
            };

            var responseResul = await _repository.Gestionar(db.Tipo, db);

            // Devolver la respuesta mapeada a Generica
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

        /// <summary>
        /// Obtiene la cédula del empleado basado en su email/correo.
        /// Utiliza el SP GTH_MostrarEmpleado con tipo 0 para búsqueda por todos los campos.
        /// </summary>
        /// <param name="email">Email del empleado a buscar</param>
        /// <returns>Cédula del empleado o null si no se encuentra</returns>
        [HttpGet("obtener-cedula-por-email/{email}")]
        public async Task<IActionResult> ObtenerCedulaPorEmail(string email)
        {
            try
            {
                // Validar que el email no esté vacío
                if (string.IsNullOrWhiteSpace(email))
                {
                    return BadRequest(new { mensaje = "El email es requerido" });
                }

                // Usar el método Mostrar con tipo 0 para búsqueda general
                var empleados = await _repository.Mostrar(0, null, null, null, null);
                
                // Buscar por email en ambos campos (correo personal y corporativo)
                var empleado = empleados.FirstOrDefault(e => 
                    (!string.IsNullOrEmpty(e.Correo) && e.Correo.Equals(email, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrEmpty(e.CorreoCorporativo) && e.CorreoCorporativo.Equals(email, StringComparison.OrdinalIgnoreCase))
                );

                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró un empleado GTH con el email proporcionado" });
                }

                // Retornar la cédula y el ID del empleado
                return Ok(new { 
                    cedula = empleado.Cedula,
                    idEmpleado = empleado.IdEmpleado,
                    nombre = empleado.Nombre,
                    apellido = empleado.Apellido
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene el ID del empleado GTH basado en su cédula.
        /// Utiliza el SP GTH_MostrarEmpleado con tipo 4 para búsqueda exclusiva por cédula.
        /// </summary>
        /// <param name="cedula">Cédula del empleado a buscar</param>
        /// <returns>ID del empleado GTH o null si no se encuentra</returns>
        [HttpGet("obtener-id-gth-empleado/{cedula}")]
        public async Task<IActionResult> ObtenerIdGthEmpleado(string cedula)
        {
            try
            {
                // Validar que la cédula no esté vacía
                if (string.IsNullOrWhiteSpace(cedula))
                {
                    return BadRequest(new { mensaje = "La cédula es requerida" });
                }

                // Usar el método Mostrar con tipo 4 para búsqueda exclusiva por cédula
                var empleados = await _repository.Mostrar(4, null, null, null, cedula);
                var empleado = empleados.FirstOrDefault();

                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró un empleado GTH con la cédula proporcionada" });
                }

                // Retornar solo el ID del empleado
                return Ok(new { idEmpleado = empleado.IdEmpleado });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene el ID del empleado GTH basado en su email/correo.
        /// Combina la búsqueda por email y obtención de ID en un solo endpoint.
        /// </summary>
        /// <param name="email">Email del empleado a buscar</param>
        /// <returns>ID del empleado GTH o null si no se encuentra</returns>
        [HttpGet("obtener-id-gth-empleado-por-email/{email}")]
        public async Task<IActionResult> ObtenerIdGthEmpleadoPorEmail(string email)
        {
            try
            {
                // Validar que el email no esté vacío
                if (string.IsNullOrWhiteSpace(email))
                {
                    return BadRequest(new { mensaje = "El email es requerido" });
                }

                // Usar el método Mostrar con tipo 0 para búsqueda general
                var empleados = await _repository.Mostrar(0, null, null, null, null);
                
                // Buscar por email en ambos campos (correo personal y corporativo)
                var empleado = empleados.FirstOrDefault(e => 
                    (!string.IsNullOrEmpty(e.Correo) && e.Correo.Equals(email, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrEmpty(e.CorreoCorporativo) && e.CorreoCorporativo.Equals(email, StringComparison.OrdinalIgnoreCase))
                );

                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró un empleado GTH con el email proporcionado" });
                }

                // Retornar solo el ID del empleado
                return Ok(new { idEmpleado = empleado.IdEmpleado });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

    }
}
