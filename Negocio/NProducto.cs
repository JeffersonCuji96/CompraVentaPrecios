using Datos;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Datos.DataAnnotations;

namespace Negocio
{
    public class NProducto
    {
        public List<TProducto> Listar()
        {
            using (var db = new BDVentaCompraEntities())
            {
                var lstProductos = (from p in db.TProducto select p).ToList();
                return lstProductos;
            }
        }
        public TProducto Obtener(int id)
        {
            using (var db = new BDVentaCompraEntities())
            {
                var oProducto = (from p in db.TProducto.Where(x => x.IdProducto == id) select p).FirstOrDefault();
                return oProducto;
            }
        }

        public List<TempDetalleCompra> VerificarYAgregar(List<TempDetalleCompra> detalle, BDVentaCompraEntities db)
        {
            for (int i = 0; i < detalle.Count(); i++)
            {
                if (!int.TryParse(detalle[i].Producto, out _))
                {
                    var objProducto = new TProducto() { Descripcion = detalle[i].Producto };
                    db.TProducto.Add(objProducto);
                    db.SaveChanges();
                    detalle[i].Producto = objProducto.IdProducto.ToString();
                }
            }
            return detalle;
        }
        public int Guardar(TProducto objProducto)
        {
            int estado = 0;
            try
            {
                if (!string.IsNullOrEmpty(objProducto.Descripcion))
                {
                    using (var db = new BDVentaCompraEntities())
                    {
                        if (objProducto.IdProducto == 0)
                        {
                            db.TProducto.Add(objProducto);
                            db.SaveChanges();
                            estado = 1;
                        }
                        else
                        {
                            db.Entry(objProducto).State = EntityState.Modified;
                            db.SaveChanges();
                            estado = 1;
                        }
                    }
                }
            }
            catch { estado = 2; }
            return estado;
        }
        public int Eliminar(int id)
        {
            int estado = 0;
            try
            {
                using (var db = new BDVentaCompraEntities())
                {
                    var oProducto = (from p in db.TProducto.Where(x => x.IdProducto == id) select p).FirstOrDefault();
                    if (oProducto != null)
                    {
                        db.TProducto.Remove(oProducto);
                        db.SaveChanges();
                        estado = 1;
                    }
                }
            }
            catch { estado = 2; }
            return estado;
        }
    }
}
