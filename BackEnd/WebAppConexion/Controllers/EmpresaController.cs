using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
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
    public class EmpresaController : Controller
    {
        private readonly EmpresaRepository _repository;
        private readonly IConfiguration _config;
        public EmpresaController(EmpresaRepository repository, IConfiguration config)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _config = config;
        }

        [HttpPost("[action]")]
        public async Task<IEnumerable<Generica>> Guardar([FromBody] EmpresaViewModel model)
        {
            Empresa db = new Empresa();
            db.IdEmpresa = model.IdEmpresa;
            db.RazonSocial = model.RazonSocial;
            db.NombreComercial = model.NombreComercial;
            db.Ruc = model.Ruc;
            db.NumResolucion = model.NumResolucion;
            db.Direccion = model.Direccion;
            db.Correo = model.Correo;
            db.Telefono = model.Telefono;
            db.Obligado = model.Obligado;
            db.Regimen = model.Regimen;
            db.RutaCertificado = model.RutaCertificado;
            db.ClaveCertificado = model.ClaveCertificado;
            db.RutaImagen = model.RutaImagen;
            db.Archivo64Certificado = model.Archivo64Certificado;
            db.Archivo64Imagen = model.Archivo64Imagen;
            db.FechaCaducidad = model.FechaCaducidad;
            db.RecortarDetalle = model.RecortarDetalle;
            db.Estado = model.Estado;
            db.Tipo = model.Tipo;

            var responseResul = await _repository.InsertEmpresa(db);
            return responseResul.Select(s => new Generica
            {
                valor1 = s.valor1,
                valor2 = s.valor2
            });
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<EmpresaViewModel>> MostrarEmpresa(Int64 IdEmpresa, Int32 Tipo)
        {

            var response = await _repository.GetByMostrarEmpresa(IdEmpresa, Tipo);
            return response.Select(s => new EmpresaViewModel
            {
                IdEmpresa = s.IdEmpresa,
                NombreComercial = s.NombreComercial,
                RazonSocial = s.RazonSocial,
                Ruc = s.Ruc,
                NumResolucion = s.NumResolucion,
                Direccion = s.Direccion,
                Correo = s.Correo,
                Telefono = s.Telefono,
                Obligado = s.Obligado,
                Regimen = s.Regimen,
                ClaveCertificado = s.ClaveCertificado,
                FechaCaducidad = s.FechaCaducidad,
                RecortarDetalle = s.RecortarDetalle,
                Estado = s.Estado,
            });

        }


    }

}
