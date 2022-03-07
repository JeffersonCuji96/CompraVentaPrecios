using Datos;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Negocio
{
    public class NGasto
    {
        public List<TGasto> Listar()
        {
            using (var db = new BDVentaCompraEntities())
            {
                var lstGastos = (from p in db.TGasto select p).ToList();
                return lstGastos;
            }
        }
        public TGasto Obtener(int id)
        {
            using (var db = new BDVentaCompraEntities())
            {
                var oGasto = (from p in db.TGasto.Where(x => x.IdGasto == id) select p).FirstOrDefault();
                return oGasto;
            }
        }
        public int Guardar(TGasto objGasto)
        {
            int estado = 0;
            try
            {
                if (!string.IsNullOrEmpty(objGasto.Descripcion))
                {
                    using (var db = new BDVentaCompraEntities())
                    {
                        bool verificacion = db.TGasto.Any(x=>x.Descripcion==objGasto.Descripcion.Trim());
                        if (verificacion)
                        {
                            estado = 3;
                            return estado;
                        }
                        if (objGasto.IdGasto == 0)
                        {
                            db.TGasto.Add(objGasto);
                            db.SaveChanges();
                            estado = 1;
                        }
                        else
                        {
                            db.Entry(objGasto).State = EntityState.Modified;
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
                    var oGasto = (from p in db.TGasto.Where(x => x.IdGasto == id) select p).FirstOrDefault();
                    if (oGasto != null)
                    {
                        db.TGasto.Remove(oGasto);
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