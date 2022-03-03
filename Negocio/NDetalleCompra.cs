using Datos;
using Datos.DataAnnotations;
using System;
using System.Collections.Generic;

namespace Negocio
{
    public class NDetalleCompra
    {
        public void Guardar(List<TempDetalleCompra> detalle, long idCompra, decimal porcentajeCosto, decimal montoPorcentaje, BDVentaCompraEntities db)
        {
            for (int i = 0; i < detalle.Count; i++)
            {
                var objDetalleCompra = new TDetalleCompra();
                decimal precio = Convert.ToDecimal(detalle[i].Precio);
                objDetalleCompra.Cantidad = detalle[i].Cantidad;
                objDetalleCompra.Precio = precio;
                objDetalleCompra.TotalFactura = Math.Round(precio * detalle[i].Cantidad, 2);
                objDetalleCompra.PorcentajeCosto = porcentajeCosto;
                objDetalleCompra.CostoUnidad = Math.Round(precio * montoPorcentaje - precio, 2);
                decimal unitario = Math.Round(precio * montoPorcentaje, 2);
                objDetalleCompra.CostoUnitario = unitario;
                objDetalleCompra.CostoTotal = Math.Round(unitario * detalle[i].Cantidad, 2);
                objDetalleCompra.IdCompra = idCompra;
                objDetalleCompra.IdProducto = Convert.ToInt64(detalle[i].Producto);
                db.TDetalleCompra.Add(objDetalleCompra);
                db.SaveChanges();
            }
        }
    }
}
