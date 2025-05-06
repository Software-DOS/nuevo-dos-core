using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class Proveedor
    {
        public Int64 IdProveedor { get; set; }
        public Int64 IdPlanCuenta { get; set; }
        public string Descripcion { get; set; }
        public string Nombre { get; set; }
        public string NombreComercial { get; set; }
        public string RuCedula { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string CodContable { get; set; }
        public string AutorizacionSri { get; set; }
        public DateTime FechaAutorizacion { get; set; }
        public DateTime FechaCaducidad { get; set; }
        public int Estado { get; set; }
        public string Retencion { get; set; }
        public int Tipo { get; set; }
    }
}
