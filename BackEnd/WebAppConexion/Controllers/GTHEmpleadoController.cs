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
                Correo = model.Correo.ToLower(),
                CorreoCorporativo = model.CorreoCorporativo?.ToLower(),
                FechaContratacion = model.FechaContratacion,
                EstadoCivil = model.EstadoCivil,
                Sexo = model.Sexo,
                FotoPerfilUrl = model.FotoPerfilUrl,
                EstadoEmpleado = model.EstadoEmpleado,
                EmpTipo = model.EmpTipo,
                Sueldo = model.Sueldo
            };

            var responseResul = await _repository.Gestionar(db.Tipo, db);

            // Devolver la respuesta mapeada a Generica
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }
        [HttpGet("[action]")]
        public async Task<IEnumerable<GTHEmpleadoViewModel>> Mostrar(
        [FromQuery] int tipo,
        [FromQuery] int? idEmpleado = null,
        [FromQuery] int? idCelula = null,
        [FromQuery] string estadoEmpleado = null)
        {
            // Llamamos al repositorio con los filtros
            var entidades = await _repository.Mostrar(tipo, idEmpleado, idCelula, estadoEmpleado);

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
                Sueldo = e.Sueldo
            });
        }


    }
}
