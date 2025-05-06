using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class Empresa
    {
        public Int64 IdEmpresa { get; set; }
        public string RazonSocial { get; set; }
        public string NombreComercial { get; set; }
        public string Ruc { get; set; }
        public string NumResolucion { get; set; }
        public string Direccion { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string Obligado { get; set; }
        public string Regimen { get; set; }
        public string RutaCertificado { get; set; }
        public string ClaveCertificado { get; set; }
        public string RutaImagen { get; set; }
        public string Archivo64Certificado { get; set; }
        public string Archivo64Imagen { get; set; }
        public DateTime FechaCaducidad { get; set; }
        public int RecortarDetalle { get; set; }
        public string ImagenString64 { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
