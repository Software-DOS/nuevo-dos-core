using Conexion.AccesoDatos.Repository.CArchivo;
using Conexion.Entidad.Administracion;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.AccesoDatos.Repository.Administracion
{
    public class EmpresaRepository
    {
        private readonly string _connectionString;

        public EmpresaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Conexion");
        }

        public async Task<IEnumerable<Generica>> InsertEmpresa(Empresa empresa)
        {
            var response = new List<Generica>();
            #region GuardarArchivos
            PrmConfiguracionArchivo archivo = new PrmConfiguracionArchivo();
            CargarXLSX cargar1 = new CargarXLSX(_connectionString);
            string rutaCer = "";
            string rutaImag = "";
            string rutaCertificado = "";
            string rutaImagen = "";

            #region Certificado
            if (empresa.RutaCertificado != "")
            {
                archivo = cargar1.MostrarCargaArhivoConfig(0, 0, "CERTIFICADO");
                rutaCer = archivo.RutaArchivo; //"E:\\SubirArchivo\\";
                byte[] archivoBytesCert = Convert.FromBase64String(empresa.Archivo64Certificado);
                System.IO.File.WriteAllBytes(rutaCer + empresa.RutaCertificado, archivoBytesCert);
                rutaCertificado = rutaCer + empresa.RutaCertificado;
                X509Certificate2 m_cer = new X509Certificate2(rutaCertificado, empresa.ClaveCertificado);
                if (m_cer != null)
                {
                    string results = m_cer.GetExpirationDateString();
                    empresa.FechaCaducidad = Convert.ToDateTime(results);
                }
                else
                {
                    Generica generica = new Generica();
                    generica.valor1 = 3;
                    generica.valor2 = "La clave del certificado no es correcta";
                    response.Add(generica);
                    return response;
                }

            }
            #endregion

            #region Imagen
            if (empresa.RutaImagen != "")
            {
                archivo = cargar1.MostrarCargaArhivoConfig(0, 0, "LOGO PDF");
                rutaImag = archivo.RutaArchivo; //"E:\\SubirArchivo\\";
                byte[] archivoBytesImag = Convert.FromBase64String(empresa.Archivo64Imagen);
                System.IO.File.WriteAllBytes(rutaImag + empresa.RutaImagen, archivoBytesImag);
                rutaImagen = rutaImag + empresa.RutaImagen;
            }
            #endregion
            #endregion

            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertarModificarEliminarEmpresa", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", empresa.IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@RazonSocial", empresa.RazonSocial));
                    cmd.Parameters.Add(new SqlParameter("@NombreComercial", empresa.NombreComercial));
                    cmd.Parameters.Add(new SqlParameter("@Ruc", empresa.Ruc));
                    cmd.Parameters.Add(new SqlParameter("@NumResolucion", empresa.NumResolucion));
                    cmd.Parameters.Add(new SqlParameter("@Direccion", empresa.Direccion));
                    cmd.Parameters.Add(new SqlParameter("@Correo", empresa.Correo));
                    cmd.Parameters.Add(new SqlParameter("@Telefono", empresa.Telefono));
                    cmd.Parameters.Add(new SqlParameter("@Obligado", empresa.Obligado));
                    cmd.Parameters.Add(new SqlParameter("@Regimen", empresa.Regimen));
                    cmd.Parameters.Add(new SqlParameter("@RutaCertificado", rutaCertificado));
                    cmd.Parameters.Add(new SqlParameter("@ClaveCertificado", empresa.ClaveCertificado));
                    cmd.Parameters.Add(new SqlParameter("@RutaImagen", rutaImagen));
                    cmd.Parameters.Add(new SqlParameter("@FechaCaducidad", empresa.FechaCaducidad));
                    cmd.Parameters.Add(new SqlParameter("@RecortarDetalle", empresa.RecortarDetalle));
                    cmd.Parameters.Add(new SqlParameter("@ImagenString64", empresa.Archivo64Imagen));
                    cmd.Parameters.Add(new SqlParameter("@Estado", empresa.Estado));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", empresa.Tipo));
                    await sql.OpenAsync();
                    //await cmd.ExecuteNonQueryAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToGenerica(reader));
                        }
                    }

                    return response;
                }
            }
        }

        public async Task<IEnumerable<Empresa>> GetByMostrarEmpresa(Int64 IdEmpresa, Int32 Tipo)
        {
            using (SqlConnection sql = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MostrarEmpresa", sql))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@IdEmpresa", IdEmpresa));
                    cmd.Parameters.Add(new SqlParameter("@Tipo", Tipo));
                    var response = new List<Empresa>();
                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            response.Add(MapToEmpresa(reader));
                        }
                    }

                    return response;
                }
            }
        }

        private Generica MapToGenerica(SqlDataReader reader)
        {
            return new Generica()
            {
                valor1 = (Int16)reader["valor1"],
                valor2 = reader["valor2"].ToString()
            };
        }

        private Empresa MapToEmpresa(SqlDataReader reader)
        {
            return new Empresa()
            {
                IdEmpresa = (Int64)reader["IdEmpresa"],
                RazonSocial = reader["RazonSocial"].ToString(),
                NombreComercial = reader["NombreComercial"].ToString(),
                Ruc = reader["Ruc"].ToString(),
                NumResolucion = reader["NumResolucion"].ToString(),
                Direccion = reader["Direccion"].ToString(),
                Correo = reader["Correo"].ToString(),
                Telefono = reader["Telefono"].ToString(),
                Obligado = reader["Obligado"].ToString(),
                Regimen = reader["Regimen"].ToString(),
                RutaCertificado = reader["RutaCertificado"].ToString(),
                ClaveCertificado = reader["ClaveCertificado"].ToString(),
                RutaImagen = reader["RutaImagen"].ToString(),
                Estado = (int)reader["Estado"],
                FechaCaducidad = (DateTime)reader["FechaCaducidad"],
                RecortarDetalle = (int)reader["RecortarDetalle"],
            };
        }


    }
}
