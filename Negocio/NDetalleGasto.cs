using Datos;
using Datos.DataAnnotations;
using System;
using System.Collections.Generic;

namespace Negocio
{
    public class NDetalleGasto
    {
        public void Guardar(List<TempDetalleGasto> detalleGastos, long idCompra, BDVentaCompraEntities db)
        {
            for (int i = 0; i < detalleGastos.Count; i++)
            {
                var objDetalleGasto = new TDetalleGasto()
                {
                    Precio = Convert.ToDecimal(detalleGastos[i].Precio),
                    IdCompra = idCompra,
                    IdGasto = Convert.ToInt32(detalleGastos[i].IdGasto)
                };
                db.TDetalleGasto.Add(objDetalleGasto);
                db.SaveChanges();
            }
        }
    }
}
