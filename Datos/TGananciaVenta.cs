//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class TGananciaVenta
    {
        public long IdGanancia { get; set; }
        public decimal PorcentajeGanancia { get; set; }
        public decimal MontoPorcentajeGanancia { get; set; }
        public decimal PrecioVenta { get; set; }
        public decimal PrecioVentaEstablecido { get; set; }
        public decimal TotalVenta { get; set; }
        public decimal MontoGanancia { get; set; }
        public decimal TotalUtilidadBruta { get; set; }
        public int UnidadesVendidas { get; set; }
        public decimal TotalVendido { get; set; }
        public int Stock { get; set; }
        public long IdCompra { get; set; }
    
        public virtual TCompra TCompra { get; set; }
    }
}
