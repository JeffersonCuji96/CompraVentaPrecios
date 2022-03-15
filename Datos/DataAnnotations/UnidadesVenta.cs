using System.ComponentModel.DataAnnotations;

namespace Datos.DataAnnotations
{
    public class UnidadesVenta
    {
        [Required(ErrorMessage = "El identificador de ganancia/venta es requerida")]
        public long IdGanancia { get; set; }

        [Required(ErrorMessage = "La cantidad vendida es requerida")]
        public int Cantidad { get; set; }
    }
}
