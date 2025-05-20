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
        public int? Cedula { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string CorreoCorporativo { get; set; }
        public DateTime? FechaContratacion { get; set; }
        public string EstadoCivil { get; set; }
        public string Sexo { get; set; }
        public string FotoPerfilUrl { get; set; }
        public string EstadoEmpleado { get; set; }
        public int? EmpTipo { get; set; }
        public bool? ActPassword { get; set; }
        public string Password { get; set; }
        public decimal? Sueldo { get; set; }
    }
}
