using Datos;
using Negocio;
using System.Web.Mvc;

namespace CompraVentaPrecios.Controllers
{
    public class GastoController : Controller
    {
        private readonly NGasto nGasto = new NGasto();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult Listar()
        {
            var lstGastos = nGasto.Listar();
            return Json(new { data = lstGastos }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Obtener(int id)
        {
            var objGasto = nGasto.Obtener(id);
            return Json(new { objGasto }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Guardar(TGasto objGasto)
        {
            int res = nGasto.Guardar(objGasto);
            return Json(new { estado = res }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Eliminar(int id)
        {
            int res = nGasto.Eliminar(id);
            return Json(new { estado = res }, JsonRequestBehavior.AllowGet);
        }
    }
}