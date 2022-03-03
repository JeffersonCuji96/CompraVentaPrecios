using Datos;
using System;

namespace Negocio
{
    public class NCompra
    {
        public long Guardar(DateTime fecha, decimal monto, BDVentaCompraEntities db)
        {
            var objCompra = new TCompra() { Fecha = fecha, Monto = monto };
            db.TCompra.Add(objCompra);
            db.SaveChanges();
            return objCompra.IdCompra;
        }
    }
}
