namespace WebAppConexion.Models
{
    // ViewModel para la vista de En Curso
    public class GTHAsignacionCapacitacionEnCursoViewModel
    {
        public long IdAsignacion { get; set; }
        public string Empleado { get; set; }
        public string Nombre { get; set; }
        public int? Duracion { get; set; }
        public System.DateTime? FechaInicio { get; set; }
        public string Certificacion { get; set; }
        public int? Progreso { get; set; }
    }
}
