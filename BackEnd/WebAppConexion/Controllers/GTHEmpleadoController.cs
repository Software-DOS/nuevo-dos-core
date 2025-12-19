using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAppConexion.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class GTHEmpleadoController : Controller
    {
        private readonly GTHEmpleadoRepository _repository;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _webHostEnvironment;
        
        public GTHEmpleadoController(GTHEmpleadoRepository repository, IConfiguration config, IWebHostEnvironment webHostEnvironment)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
            _webHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// Devuelve la lista de empleados según los filtros proporcionados.
        /// 1 = IdEmpleado, 2 = IdCelula, 3 = estadoEmpleado, 0 = Todos.
        /// </summary>
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHEmpleadoViewModel>> Mostrar(
        [FromQuery] int tipo,
        [FromQuery] int? idEmpleado = null,
        [FromQuery] int? idCelula = null,
        [FromQuery] string estadoEmpleado = null,
        [FromQuery] string cedulaEmpleado = null)
        {
            var entidades = await _repository.Mostrar(tipo, idEmpleado, idCelula, estadoEmpleado, cedulaEmpleado);

            return entidades.Select(e => new GTHEmpleadoViewModel
            {
                Tipo = e.Tipo,
                //IdEmpleado = e.IdEmpleado,
                IdEmpleado = e.IdEmpleadoAD,
                // ← AGREGAR ESTA LÍNEA
                IdEmpleadoAD = e.IdEmpleadoAD,

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
                Subarea = e.Subarea,
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
                Correo = model.Correo?.ToLower(),                    // ✅ Agregar ?
                CorreoCorporativo = model.CorreoCorporativo?.ToLower(), // ✅ Ya lo tenías
                FechaContratacion = model.FechaContratacion,
                EstadoCivil = model.EstadoCivil,
                Sexo = model.Sexo,
                FotoPerfilUrl = model.FotoPerfilUrl,
                EstadoEmpleado = model.EstadoEmpleado,
                EmpTipo = model.EmpTipo,
                Sueldo = model.Sueldo,
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
                Subarea = model.Subarea,
                Empresa = model.Empresa,
                JefeDirecto = model.JefeDirecto,
                TipoContrato = model.TipoContrato,
                Ubicacion = model.Ubicacion
            };

            var responseResul = await _repository.Gestionar(db.Tipo, db);

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

        /// <summary>
        /// Sube una foto de perfil para un empleado GTH
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <param name="archivo">Archivo de imagen a subir</param>
        /// <returns>URL de la imagen subida</returns>
        [HttpPost("subir-foto-perfil/{idEmpleado}")]
        public async Task<IActionResult> SubirFotoPerfil(long idEmpleado, IFormFile archivo)
        {
            try
            {
                // Validar que se haya enviado un archivo
                if (archivo == null || archivo.Length == 0)
                {
                    return BadRequest(new { mensaje = "No se ha enviado ningún archivo" });
                }

                // Validar el tipo de archivo
                var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
                
                if (!extensionesPermitidas.Contains(extension))
                {
                    return BadRequest(new { mensaje = "Tipo de archivo no permitido. Solo se permiten: " + string.Join(", ", extensionesPermitidas) });
                }

                // Validar tamaño del archivo (5MB máximo)
                if (archivo.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { mensaje = "El archivo es demasiado grande. Tamaño máximo: 5MB" });
                }

                // Verificar que el empleado existe
                var empleados = await _repository.Mostrar(1, (int)idEmpleado, null, null, null);
                var empleado = empleados.FirstOrDefault();
                
                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });
                }

                // Crear el directorio si no existe
                var uploadsPath = Path.Combine(_webHostEnvironment.WebRootPath, "img", "usuarios");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Usar nombre fijo por empleado (sin timestamp para evitar acumulación de archivos)
                var nombreArchivo = $"empleado_{idEmpleado}{extension}";
                var rutaCompleta = Path.Combine(uploadsPath, nombreArchivo);

                // LIMPIEZA AUTOMÁTICA: Eliminar TODOS los archivos anteriores del empleado (cualquier extensión)
                var patronBusqueda = $"empleado_{idEmpleado}.*";
                var archivosAEliminar = Directory.GetFiles(uploadsPath, patronBusqueda);
                
                foreach (var archivoAEliminar in archivosAEliminar)
                {
                    try
                    {
                        System.IO.File.Delete(archivoAEliminar);
                        Console.WriteLine($"Archivo anterior eliminado: {Path.GetFileName(archivoAEliminar)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar archivo {Path.GetFileName(archivoAEliminar)}: {ex.Message}");
                    }
                }

                // También limpiar archivos con timestamp del mismo empleado (migración de formato anterior)
                var archivosConTimestamp = Directory.GetFiles(uploadsPath, $"empleado_{idEmpleado}_*.*");
                foreach (var archivoAntiguo in archivosConTimestamp)
                {
                    try
                    {
                        System.IO.File.Delete(archivoAntiguo);
                        Console.WriteLine($"Archivo con timestamp eliminado: {Path.GetFileName(archivoAntiguo)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al eliminar archivo con timestamp {Path.GetFileName(archivoAntiguo)}: {ex.Message}");
                    }
                }

                // Guardar el archivo
                using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                // Actualizar la URL en la base de datos
                var urlFoto = $"/img/usuarios/{nombreArchivo}";
                empleado.FotoPerfilUrl = urlFoto;
                empleado.Tipo = 1; // Tipo 1 para actualizar

                await _repository.Gestionar(empleado.Tipo, empleado);

                return Ok(new { 
                    mensaje = "Foto de perfil actualizada exitosamente",
                    fotoPerfilUrl = urlFoto,
                    nombreArchivo = nombreArchivo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene la foto de perfil de un empleado específico
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <returns>URL de la foto de perfil o imagen por defecto</returns>
        [HttpGet("foto-perfil/{idEmpleado}")]
        public async Task<IActionResult> ObtenerFotoPerfil(long idEmpleado)
        {
            try
            {
                // Buscar el empleado
                var empleados = await _repository.Mostrar(1, (int)idEmpleado, null, null, null);
                var empleado = empleados.FirstOrDefault();

                if (empleado == null)
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });

                // Ruta relativa o default
                var fotoUrlRelativa = !string.IsNullOrEmpty(empleado.FotoPerfilUrl)
                    ? empleado.FotoPerfilUrl
                    : "img/usuarios/default-avatar.png";

                // Ruta física en el servidor
                var rutaCompleta = Path.Combine(_webHostEnvironment.WebRootPath, fotoUrlRelativa.Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (!System.IO.File.Exists(rutaCompleta))
                {
                    fotoUrlRelativa = "img/usuarios/default-avatar.png";
                }

                // Construir URL pública (baseUrl + ruta relativa)
                var request = HttpContext.Request;
                var baseUrl = $"{request.Scheme}://{request.Host}";
                var fotoUrlPublica = $"{baseUrl}/{fotoUrlRelativa.Replace("\\", "/")}";

                return Ok(new
                {
                    fotoPerfilUrl = fotoUrlPublica,
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
        /// Elimina la foto de perfil de un empleado y restaura la imagen por defecto
        /// </summary>
        /// <param name="idEmpleado">ID del empleado</param>
        /// <returns>Confirmación de eliminación</returns>
        [HttpDelete("eliminar-foto-perfil/{idEmpleado}")]
        public async Task<IActionResult> EliminarFotoPerfil(long idEmpleado)
        {
            try
            {
                // Buscar el empleado
                var empleados = await _repository.Mostrar(1, (int)idEmpleado, null, null, null);
                var empleado = empleados.FirstOrDefault();

                if (empleado == null)
                {
                    return NotFound(new { mensaje = "No se encontró el empleado especificado" });
                }

                // Eliminar archivo físico si existe y no es la imagen por defecto
                if (!string.IsNullOrEmpty(empleado.FotoPerfilUrl) && empleado.FotoPerfilUrl != "/img/usuarios/default-avatar.png")
                {
                    var nombreArchivo = empleado.FotoPerfilUrl.Replace("/img/usuarios/", "");
                    var rutaCompleta = Path.Combine(_webHostEnvironment.WebRootPath, "img", "usuarios", nombreArchivo);
                    
                    if (System.IO.File.Exists(rutaCompleta))
                    {
                        System.IO.File.Delete(rutaCompleta);
                    }
                }

                // Actualizar la base de datos con imagen por defecto
                empleado.FotoPerfilUrl = "/img/usuarios/default-avatar.png";
                empleado.Tipo = 1; // Tipo 1 para actualizar

                await _repository.Gestionar(empleado.Tipo, empleado);

                return Ok(new { 
                    mensaje = "Foto de perfil eliminada exitosamente",
                    fotoPerfilUrl = "/img/usuarios/default-avatar.png"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        /// <summary>
        /// Limpia archivos huérfanos de fotos de empleados (opcional - para mantenimiento)
        /// </summary>
        /// <returns>Resultado de la limpieza</returns>
        [HttpPost("limpiar-fotos-huerfanas")]
        public async Task<IActionResult> LimpiarFotosHuerfanas()
        {
            try
            {
                var uploadsPath = Path.Combine(_webHostEnvironment.WebRootPath, "img", "usuarios");
                if (!Directory.Exists(uploadsPath))
                {
                    return Ok(new { mensaje = "No existe la carpeta de fotos", archivosEliminados = 0 });
                }

                // Obtener todos los empleados con sus fotos
                var empleados = await _repository.Mostrar(0); // Tipo 0 = todos los empleados
                var empleadosConFoto = empleados.Where(e => !string.IsNullOrEmpty(e.FotoPerfilUrl))
                                               .ToList();

                // Extraer solo los nombres de archivo (sin ruta) de las fotos en uso
                var fotosEnUso = empleadosConFoto.Select(e => e.FotoPerfilUrl.Replace("/img/usuarios/", ""))
                                               .Where(f => !string.IsNullOrEmpty(f))
                                               .ToHashSet();

                // Obtener IDs de empleados activos para validar archivos
                var idsEmpleadosActivos = empleados.Select(e => e.IdEmpleado).ToHashSet();

                // Obtener todos los archivos de empleados en el directorio
                var archivosEmpleados = Directory.GetFiles(uploadsPath, "empleado_*.*")
                                               .Select(f => Path.GetFileName(f))
                                               .ToList();

                int archivosEliminados = 0;
                var archivosEliminadosList = new List<string>();

                // Eliminar archivos que no están en uso
                foreach (var archivo in archivosEmpleados)
                {
                    bool debeEliminar = false;
                    string razon = "";

                    // Verificar si el archivo está en uso
                    if (!fotosEnUso.Contains(archivo))
                    {
                        // Extraer ID del empleado del nombre del archivo
                        var parts = archivo.Split('_');
                        if (parts.Length >= 2 && int.TryParse(parts[1].Split('.')[0], out int idEmpleado))
                        {
                            // Si el empleado no existe, marcar para eliminación
                            if (!idsEmpleadosActivos.Contains(idEmpleado))
                            {
                                debeEliminar = true;
                                razon = "empleado no existe";
                            }
                            else
                            {
                                debeEliminar = true;
                                razon = "archivo no referenciado en BD";
                            }
                        }
                        else
                        {
                            debeEliminar = true;
                            razon = "formato de archivo inválido";
                        }
                    }

                    if (debeEliminar)
                    {
                        try
                        {
                            var rutaCompleta = Path.Combine(uploadsPath, archivo);
                            System.IO.File.Delete(rutaCompleta);
                            archivosEliminados++;
                            archivosEliminadosList.Add($"{archivo} ({razon})");
                            Console.WriteLine($"Archivo huérfano eliminado: {archivo} - Razón: {razon}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error al eliminar {archivo}: {ex.Message}");
                        }
                    }
                }

                return Ok(new { 
                    mensaje = $"Limpieza completada. {archivosEliminados} archivos huérfanos eliminados.",
                    archivosEliminados = archivosEliminados,
                    archivosEnUso = fotosEnUso.Count,
                    empleadosConFoto = empleadosConFoto.Count,
                    archivosEliminadosDetalle = archivosEliminadosList
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

    }
}
