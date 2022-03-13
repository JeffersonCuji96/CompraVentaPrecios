using System.ComponentModel.DataAnnotations;

namespace Datos.DataAnnotations
{
    public class DetalleGananciaVenta
    {
        [Required(ErrorMessage = "Porcentaje de ganancia requerido")]
        [Range(10, 99, ErrorMessage = "Porcentaje mínimo del 10% y máximo del 99%")]
        [RegularExpression(@"^\d+(.\d{1,2})?$", ErrorMessage = "Porcentaje de ganancia, admite coma y 2 decimales")]
        public decimal PorcentajeGanancia { get; set; }

        [Required(ErrorMessage = "Monto del porcentaje de ganancia requerido")]
        public decimal MontoPorcentajeGanancia { get; set; }

        [Required(ErrorMessage = "Precio de venta requerido")]
        public decimal PrecioVenta { get; set; }

        [Required(ErrorMessage = "Precio de venta establecido requerido")]
        [RegularExpression(@"^\d+(.\d{1,2})?$", ErrorMessage = "Precio de venta establecido numérico, admite coma y 2 decimales")]
        public decimal PrecioVentaEstablecido { get; set; }

        [Required(ErrorMessage = "Total de la venta requerido")]
        public decimal TotalVenta { get; set; }

        [Required(ErrorMessage = "Monto de ganancia requerido")]
        public decimal MontoGanancia { get; set; }

        [Required(ErrorMessage = "Utilidad bruta requerido")]
        public decimal TotalUtilidadBruta { get; set; }

        [Required(ErrorMessage = "Unidades vendidas requerido")]
        public int UnidadesVendidas { get; set; }

        [Required(ErrorMessage = "Total vendido requerido")]
        public decimal TotalVendido { get; set; }

        [Required(ErrorMessage = "Stock requerido")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Compra requerida")]
        public long IdCompra { get; set; }
    }
}
