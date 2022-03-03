using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Datos.DataAnnotations
{
    public class DetalleCompraGasto
    {
        [Required(ErrorMessage = "Fecha requerida")]
        public DateTime Fecha { get; set; }
        public List<TempDetalleCompra> DetalleCompra { get; set; }
        public List<TempDetalleGasto> DetalleGasto { get; set; }
    }

    public class TempDetalleCompra
    {
        [Required(ErrorMessage = "Producto requerido")]
        public string Producto { get; set; }
        
        [Required(ErrorMessage = "Cantidad del producto requerido")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "Cantidad del producto de ser numérico")]
        [Range(1, 100, ErrorMessage = "Cantidad del producto mínimo 1")]
        public int Cantidad { get; set; }
        
        [Required(ErrorMessage = "Precio del producto requerido")]
        [RegularExpression(@"^[0-9]+(,[0-9]{1,2})?$", ErrorMessage = "Precio incorrecto del producto, admite coma y 2 decimales")]
        public string Precio { get; set; }
    }
    public class TempDetalleGasto
    {
        [Required(ErrorMessage = "Gasto requerido")]
        public long IdGasto { get; set; }

        [Required(ErrorMessage = "Precio del gasto requerido")]
        [RegularExpression(@"^[0-9]+(,[0-9]{1,2})?$", ErrorMessage = "Precio incorrecto del gasto, admite coma y 2 decimales")]
        public string Precio { get; set; }
    }
}