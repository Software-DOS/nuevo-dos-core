using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class PrmMenuRepository
    {
        private readonly string _connectionString;

        public PrmMenuRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<PrmMenu>> GetByMostrarMenu(Int64 IdEmpleado)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarMenuDinamicoEmpleado", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpleado", IdEmpleado));
                    var response = new List<PrmMenu>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToMenu(reader));
                        }
                        //Cargar subMenu

                    }
                    return CargarSubMenu(response);
                }
            }
        }

        private PrmMenu MapToMenu(SqlDataReader reader)
        {
            return new PrmMenu()
            {
                IdMenu = (Int64)reader["IdMenu"],
                IdPadre = (Int64)reader["IdPadre"],
                Estado = (int)reader["Estado"],
                Titulo = reader["Titulo"].ToString(),
                Ruta = reader["Ruta"].ToString(),
                Icono = reader["Icono"].ToString()
            };
        }

        private List<PrmMenu> CargarSubMenu(List<PrmMenu> menus)
        {
            List<PrmMenu> envApi = new List<PrmMenu>();

            for (int i = 0; i < menus.Count; i++)
            {
                if (menus[i].IdPadre == 0)
                {
                    envApi.Add(menus[i]);
                }
            }
            for (int a = 0; a < envApi.Count; a++)
            {
                List<PrmMenu> filteredList = menus.Where(x => x.IdPadre == envApi[a].IdMenu).ToList();
                List<SubMenu> lista = new List<SubMenu>();
                for (int i = 0; i < filteredList.Count; i++)
                {
                    SubMenu subMenu = new SubMenu();
                    subMenu.IdMenu = filteredList[i].IdMenu;
                    subMenu.IdPadre = filteredList[i].IdPadre;
                    subMenu.Estado = filteredList[i].Estado;
                    subMenu.Titulo = filteredList[i].Titulo;
                    subMenu.Ruta = filteredList[i].Ruta;
                    subMenu.Icono = filteredList[i].Icono;
                    lista.Add(subMenu);
                }
                envApi[a].subMenu = lista.ToList();
            }

            return envApi;
        }
    }
}
