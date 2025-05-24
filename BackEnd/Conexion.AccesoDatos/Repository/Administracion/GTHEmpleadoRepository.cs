using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class GTHEmpleadoRepository
    {
        private readonly string _connectionString;

        public GTHEmpleadoRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        /// <summary>
        /// Ejecuta SP para insertar, actualizar o eliminar un empleado.
        /// </summary>
        public async Task<IEnumerable<Generica>> Manage(int tipo, GTHEmpleado empleado)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SP_Gestionar_GTH_EMPLEADO", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));
            cmd.Parameters.Add(new SqlParameter("@ID_EMPLEADO", empleado.IdEmpleado));
            cmd.Parameters.Add(new SqlParameter("@ID_PERFIL", empleado.IdPerfil ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_CELULA", empleado.IdCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CEDULA", empleado.Cedula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_NOMBRE", empleado.Nombre ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_APELLIDO", empleado.Apellido ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FECHANACIMIENTO", empleado.FechaNacimiento ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_DIRECCION", empleado.Direccion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TELEFONO", empleado.Telefono ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CORREO", empleado.Correo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_CORREOCORPORATIVO", empleado.CorreoCorporativo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FECHACONTRATACION", empleado.FechaContratacion ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ESTADOCIVIL", empleado.EstadoCivil ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_SEXO", empleado.Sexo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_FOTOPERFILURL", empleado.FotoPerfilUrl ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ESTADOEMPLEADO", empleado.EstadoEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_TIPO", empleado.EmpTipo ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_ACT_PASSWORD", empleado.ActPassword ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_PASSWORD", empleado.Password ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@EMP_SUELDO", empleado.Sueldo ?? (object)DBNull.Value));

            await sql.OpenAsync();
            var response = new List<Generica>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Generica
                {
                    valor1 = Convert.ToInt16(reader["Codigo"] ?? reader["CodigoEstado"]),
                    valor2 = reader[reader.GetName(0)].ToString()
                });
            }
            return response;
        }

        /// <summary>
        /// Ejecuta SP para mostrar empleados según filtros.
        /// </summary>
        public async Task<IEnumerable<GTHEmpleado>> Show(int tipo,
            int? idEmpleado = null,
            int? idCelula = null,
            string estadoEmpleado = null)
        {
            using var sql = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("GTH_MostrarEmpleado", sql)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.Add(new SqlParameter("@ID_Empleado", idEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@ID_Celula", idCelula ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Emp_EstadoEmpleado", estadoEmpleado ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@Tipo", tipo));

            await sql.OpenAsync();
            var list = new List<GTHEmpleado>();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new GTHEmpleado
                {
                    IdEmpleado = (long)reader["ID_EMPLEADO"],
                    IdPerfil = reader["ID_PERFIL"] as long?,
                    IdCelula = reader["ID_CELULA"] as long?,
                    Cedula = reader["EMP_CEDULA"].ToString(),
                    Nombre = reader["EMP_NOMBRE"].ToString(),
                    Apellido = reader["EMP_APELLIDO"].ToString(),
                    FechaNacimiento = reader["EMP_FECHANACIMIENTO"] as DateTime?,
                    Direccion = reader["EMP_DIRECCION"].ToString(),
                    Telefono = reader["EMP_TELEFONO"].ToString(),
                    Correo = reader["EMP_CORREO"].ToString(),
                    CorreoCorporativo = reader["EMP_CORREOCORPORATIVO"].ToString(),
                    FechaContratacion = reader["EMP_FECHACONTRATACION"] as DateTime?,
                    EstadoCivil = reader["EMP_ESTADOCIVIL"].ToString(),
                    Sexo = reader["EMP_SEXO"].ToString(),
                    FotoPerfilUrl = reader["EMP_FOTOPERFILURL"].ToString(),
                    EstadoEmpleado = reader["EMP_ESTADOEMPLEADO"].ToString(),
                    EmpTipo = reader["EMP_TIPO"] as int?,
                    ActPassword = reader["EMP_ACT_PASSWORD"] as bool?,
                    Password = reader["EMP_PASSWORD"].ToString(),
                    Sueldo = reader["EMP_SUELDO"] as decimal?
                });
            }
            return list;
        }
    }
}
