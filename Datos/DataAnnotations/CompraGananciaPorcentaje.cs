using Datos.ViewModels;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Datos.DataAnnotations
{
    public class CompraGananciaPorcentaje
    {
        [Required(ErrorMessage = "Detalle de la compra requerido")]
        public List<DetalleCompraViewModel> DetalleCompra { get; set; }

        [Required(ErrorMessage = "Porcentaje de ganancia requerido")]
        [Range(10, 99, ErrorMessage = "Porcentaje mínimo del 10% y máximo del 99%")]
        public decimal PorcentajeGanancia { get; set; }
    }
}
