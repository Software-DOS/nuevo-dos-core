using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.Entidad.Administracion;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : Controller
    {
        private readonly PrmMenuRepository _repository;

        public MenuController(PrmMenuRepository repository)
        {
            this._repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        // GET: api/ResultadoSufragio/MostrarMenu
        [HttpGet("[action]")]
        public async Task<IEnumerable<PrmMenu>> MostrarMenu(Int64 IdEmpleado)
        {
            var response = await _repository.GetByMostrarMenu(IdEmpleado);
            return response.Select(s => new PrmMenu
            {
                IdMenu = s.IdMenu,
                IdPadre = s.IdPadre,
                Titulo = s.Titulo,
                Estado = s.Estado,
                Ruta =s.Ruta,
                Icono=s.Icono,
                subMenu = s.subMenu
            });
        }
    }
}
