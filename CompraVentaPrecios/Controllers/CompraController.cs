using Datos.DataAnnotations;
using Negocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CompraVentaPrecios.Controllers
{
    public class CompraController : Controller
    {
        private readonly NDetalleCompraGastos nDetalleCompraGasto = new NDetalleCompraGastos();
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Guardar(DetalleCompraGasto detalle)
        {
            int estado = 0;
            if (!ModelState.IsValid)
            {
                var lstErrores = ModelState.Values.Where(E => E.Errors.Count > 0).SelectMany(E => E.Errors).Select(E => E.ErrorMessage).ToList();
                var errores = new HashSet<string>(lstErrores);
                return Json(new { errores, estado }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                if (nDetalleCompraGasto.VerificarFecha(detalle.Fecha))
                {
                    estado = 2;
                    return Json(new { estado }, JsonRequestBehavior.AllowGet);
                }
                estado = nDetalleCompraGasto.Guardar(detalle);
                return Json(new { estado }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}