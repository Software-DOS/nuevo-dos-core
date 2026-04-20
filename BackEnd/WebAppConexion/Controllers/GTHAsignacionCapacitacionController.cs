using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
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
                    CertificadoUrl = asignacion.CertificadoUrl,
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
                Progreso = e.Progreso,
                CertificadoUrl = e.CertificadoUrl
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
                Progreso = model.Progreso,
                CertificadoUrl = model.CertificadoUrl
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

        /// <summary>
        /// Sube un certificado PDF para una asignación de capacitación específica.
        /// Sigue el mismo patrón que subir-foto-perfil del empleado.
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <param name="idCapacitacion">ID de la capacitación</param>
        /// <param name="archivo">Archivo PDF del certificado</param>
        /// <returns>Información del certificado subido</returns>
        [HttpPost("subir-certificado/{idEmpleado}/{idCapacitacion}")]
        public async Task<IActionResult> SubirCertificado(long idEmpleado, long idCapacitacion, IFormFile archivo)
        {
            try
            {
                // Validar que se haya enviado un archivo
                if (archivo == null || archivo.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha enviado ningún archivo" });
                }

                // Validar el tipo de archivo (solo PDF)
                var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
                if (extension != ".pdf")
                {
                    return BadRequest(new { mensaje = "Tipo de archivo no permitido. Solo se permiten archivos PDF" });
                }

                // Validar tamaño del archivo (5MB máximo)
                if (archivo.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "El archivo es demasiado grande. Tamaño máximo: 5MB" });
                }

                // Verificar que el empleado existe
                var empleados = await _empleadoRepository.Mostrar(1, (int)idEmpleado);
                var empleado = empleados.FirstOrDefault();
                
                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });
                }

                // Verificar que la capacitación existe
                var capacitaciones = await _capacitacionRepository.Mostrar(1, (int)idCapacitacion);
                var capacitacion = capacitaciones.FirstOrDefault();
                
                if (capacitacion == null)
                {
                    return NotFound(new { mensaje = "No se encontró la capacitación especificada" });
                }

                // Verificar que existe la asignación
                var asignaciones = await _repository.Mostrar(0, (int)idCapacitacion, (int)idEmpleado);
                var asignacion = asignaciones.FirstOrDefault(a => a.IdCapacitacion == idCapacitacion && a.IdEmpleado == idEmpleado);
                
                if (asignacion == null)
                {
                    return NotFound(new { mensaje = "No se encontró la asignación de capacitación especificada" });
                }

                // Crear el directorio si no existe
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "certificados");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Usar nombre fijo por empleado y capacitación (sin timestamp para evitar acumulación)
                var nombreArchivo = $"empleado_{idEmpleado}_capacitacion_{idCapacitacion}.pdf";
                var rutaCompleta = Path.Combine(uploadsPath, nombreArchivo);

                // LIMPIEZA AUTOMÁTICA: Eliminar certificado anterior del empleado para esta capacitación
                var patronBusqueda = $"empleado_{idEmpleado}_capacitacion_{idCapacitacion}.*";
                var archivosAEliminar = Directory.GetFiles(uploadsPath, patronBusqueda);
                
                foreach (var archivoAEliminar in archivosAEliminar)
                {
                    try
                    {
                        System.IO.File.Delete(archivoAEliminar);
                        Console.WriteLine($"Certificado anterior eliminado: {Path.GetFileName(archivoAEliminar)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar certificado {Path.GetFileName(archivoAEliminar)}: {ex.Message}");
                    }
                }

                // También limpiar archivos con timestamp del mismo empleado y capacitación (migración de formato anterior)
                var archivosConTimestamp = Directory.GetFiles(uploadsPath, $"empleado_{idEmpleado}_capacitacion_{idCapacitacion}_*.*");
                foreach (var archivoAntiguo in archivosConTimestamp)
                {
                    try
                    {
                        System.IO.File.Delete(archivoAntiguo);
                        Console.WriteLine($"Certificado con timestamp eliminado: {Path.GetFileName(archivoAntiguo)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar certificado con timestamp {Path.GetFileName(archivoAntiguo)}: {ex.Message}");
                    }
                }

                // Guardar el archivo
                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                // Actualizar la URL en la base de datos Y completar al 100%
                var certificadoUrl = $"/certificados/{nombreArchivo}";
                asignacion.CertificadoUrl = certificadoUrl;
                asignacion.Progreso = 100; // COMPLETAR al 100% al subir certificado
                asignacion.Fecha = DateTime.Now; // Actualizar fecha de completado
                asignacion.Tipo = 1; // Tipo 1 para actualizar

                await _repository.Gestionar(asignacion.Tipo, asignacion, empleado.Cedula);

                return Ok(new GTHSubirCertificadoViewModel
                { 
                    Success = true,
                    Mensaje = "Certificado subido exitosamente",
                    CertificadoUrl = certificadoUrl,
                    NombreArchivo = nombreArchivo,
                    TamanoArchivo = archivo.Length
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Descarga el acuerdo plantilla para capacitaciones
        /// </summary>
        /// <returns>Archivo XLS del acuerdo plantilla</returns>
        [HttpGet("descargar-acuerdo")]
        public IActionResult DescargarAcuerdo()
        {
            try
            {
                var archivoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "archivos_estaticos", "acuerdo_capacitacion.xls");
                
                if (!System.IO.File.Exists(archivoPath))
                {
                    return NotFound(new { mensaje = "El archivo del acuerdo no se encontró" });
                }

                var fileBytes = System.IO.File.ReadAllBytes(archivoPath);
                var fileName = "acuerdo_capacitacion.xls";
                
                return File(fileBytes, "application/vnd.ms-excel", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al descargar el acuerdo", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Sube el acuerdo firmado por el empleado para una solicitud de capacitación creada
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <param name="tituloCapacitacion">Título de la capacitación para nombrar el archivo</param>
        /// <param name="archivo">Archivo XLS del acuerdo firmado</param>
        /// <returns>Información del acuerdo subido</returns>
        [HttpPost("subir-acuerdo-capacitacion/{idEmpleado}/{tituloCapacitacion}")]
        public async Task<IActionResult> SubirAcuerdoCapacitacion(long idEmpleado, string tituloCapacitacion, IFormFile archivo)
        {
            try
            {
                // Validar que se haya enviado un archivo
                if (archivo == null || archivo.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha enviado ningún archivo" });
                }

                // Validar el tipo de archivo (solo XLS)
                var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
                if (extension != ".xls" && extension != ".xlsx")
                {
                    return BadRequest(new { mensaje = "Tipo de archivo no permitido. Solo se permiten archivos XLS o XLSX" });
                }

                // Validar tamaño del archivo (10MB máximo)
                if (archivo.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "El archivo es demasiado grande. Tamaño máximo: 10MB" });
                }

                // Verificar que el empleado existe
                var empleados = await _empleadoRepository.Mostrar(1, (int)idEmpleado);
                var empleado = empleados.FirstOrDefault();
                
                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });
                }

                // Crear el directorio si no existe
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "acuerdo_capacitaciones");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Limpiar el título para usarlo en el nombre del archivo
                var tituloLimpio = string.Join("_", tituloCapacitacion.Split(Path.GetInvalidFileNameChars()))
                                        .Replace(" ", "_")
                                        .ToLowerInvariant();

                // Usar nombre descriptivo con empleado, título y timestamp
                var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var nombreArchivo = $"empleado_{idEmpleado}_acuerdo_{tituloLimpio}_{timestamp}{extension}";
                var rutaCompleta = Path.Combine(uploadsPath, nombreArchivo);

                // LIMPIEZA: Eliminar acuerdos anteriores del mismo empleado para esta capacitación
                var patronBusqueda = $"empleado_{idEmpleado}_acuerdo_{tituloLimpio}_*.*";
                var archivosAEliminar = Directory.GetFiles(uploadsPath, patronBusqueda);
                
                foreach (var archivoAEliminar in archivosAEliminar)
                {
                    try
                    {
                        System.IO.File.Delete(archivoAEliminar);
                        Console.WriteLine($"Acuerdo anterior eliminado: {Path.GetFileName(archivoAEliminar)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar acuerdo {Path.GetFileName(archivoAEliminar)}: {ex.Message}");
                    }
                }

                // Guardar el archivo
                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                return Ok(new 
                { 
                    Success = true,
                    Mensaje = "Acuerdo de capacitación subido exitosamente",
                    NombreArchivo = nombreArchivo,
                    TamanoArchivo = archivo.Length,
                    FechaSubida = DateTime.Now,
                    TituloCapacitacion = tituloCapacitacion
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Sube el acuerdo firmado por el empleado para una capacitación específica
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <param name="idCapacitacion">ID de la capacitación</param>
        /// <param name="archivo">Archivo XLS del acuerdo firmado</param>
        /// <returns>Información del acuerdo subido</returns>
        [HttpPost("subir-acuerdo/{idEmpleado}/{idCapacitacion}")]
        public async Task<IActionResult> SubirAcuerdo(long idEmpleado, long idCapacitacion, IFormFile archivo)
        {
            try
            {
                // Validar que se haya enviado un archivo
                if (archivo == null || archivo.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha enviado ningún archivo" });
                }

                // Validar el tipo de archivo (solo XLS)
                var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
                if (extension != ".xls" && extension != ".xlsx")
                {
                    return BadRequest(new { mensaje = "Tipo de archivo no permitido. Solo se permiten archivos XLS o XLSX" });
                }

                // Validar tamaño del archivo (10MB máximo)
                if (archivo.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "El archivo es demasiado grande. Tamaño máximo: 10MB" });
                }

                // Verificar que el empleado existe
                var empleados = await _empleadoRepository.Mostrar(1, (int)idEmpleado);
                var empleado = empleados.FirstOrDefault();
                
                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });
                }

                // Verificar que la capacitación existe
                var capacitaciones = await _capacitacionRepository.Mostrar(1, (int)idCapacitacion);
                var capacitacion = capacitaciones.FirstOrDefault();
                
                if (capacitacion == null)
                {
                    return NotFound(new { mensaje = "No se encontró la capacitación especificada" });
                }

                // Crear el directorio si no existe
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "acuerdo_capacitaciones");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Usar nombre con timestamp para mantener historial de acuerdos
                var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var nombreArchivo = $"empleado_{idEmpleado}_acuerdo_{timestamp}{extension}";
                var rutaCompleta = Path.Combine(uploadsPath, nombreArchivo);

                // Guardar el archivo
                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                return Ok(new 
                { 
                    Success = true,
                    Mensaje = "Acuerdo subido exitosamente",
                    NombreArchivo = nombreArchivo,
                    TamanoArchivo = archivo.Length,
                    FechaSubida = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }
    }
}
