using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GTHEmpleadoViewModel
    {
        public int Tipo { get; set; }
        public long IdEmpleado { get; set; }
        public long? IdPerfil { get; set; }
        public long? IdCelula { get; set; }
        public string Cedula { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string FechaNacimiento { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string CorreoCorporativo { get; set; }
        public string FechaContratacion { get; set; }
        public string EstadoCivil { get; set; }
        public string Sexo { get; set; }
        public string FotoPerfilUrl { get; set; }
        public string EstadoEmpleado { get; set; }
        public int? EmpTipo { get; set; }
        public bool? ActPassword { get; set; }
        public string Password { get; set; }
        public decimal? Sueldo { get; set; }
        
        // Nuevos campos añadidos
        public string TipoSangre { get; set; }
        public string Etnia { get; set; }
        public string PaisNacimiento { get; set; }
        public string ProvinciaNacimiento { get; set; }
        public string CiudadNacimiento { get; set; }
        public string NivelEstudio { get; set; }
        public int? CargasFamiliares { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string NombreEmergencia { get; set; }
        public string RelacionEmergencia { get; set; }
        public string TelefonoEmergencia { get; set; }
        public string NombreConyuge { get; set; }
        public string FechaMatrimonio { get; set; }
        public bool? DiscapacidadConyuge { get; set; }
        public string DocumentosConyuge { get; set; }
        public string CargoActual { get; set; }
        public string Area { get; set; }
        public string SubArea { get; set; }
        public string Empresa { get; set; }
        public string JefeDirecto { get; set; }
        public string TipoContrato { get; set; }
        public string Ubicacion { get; set; }
    }
}
