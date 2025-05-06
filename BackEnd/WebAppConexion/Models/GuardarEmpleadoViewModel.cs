using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppConexion.Models
{
    public class GuardarEmpleadoViewModel
    {
        public Int64 IdEmpleado { get; set; }
        public Int64 IdEmpresa { get; set; }
        public Int64 IdPerfil { get; set; }
        public string NombresApellidos { get; set; }
        public string Rucedula { get; set; }
        public decimal Sueldo { get; set; }
        public DateTime Ingreso { get; set; }
        public string Clase { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Regimen { get; set; }
        public string Correo { get; set; }
        public string Rol { get; set; }
        public string FondoReserva { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
        public bool act_password { get; set; }
        public string Contrasenia { get; set; }
    }
}
