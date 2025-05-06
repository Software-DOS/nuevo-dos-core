using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Conexion.Entidad.Administracion
{
    public class ClienteServicio
    {
        public Int64 IdClienteServicio { get; set; }
        public Int64 IdTipoIdentificacion { get; set; }
        public string RuCedula { get; set; }
        public string Descripcion { get; set; }
        public string Direccion { get; set; }
        public string Email  { get; set; }
        public string Telefono { get; set; }
        public int Estado { get; set; }
        public int Tipo { get; set; }
    }
}
