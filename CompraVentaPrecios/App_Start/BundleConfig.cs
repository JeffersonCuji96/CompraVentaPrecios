using System.Web;
using System.Web.Optimization;

namespace CompraVentaPrecios
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/Plugins/css").Include(
                         "~/Content/DataTable/css/jquery.dataTables.min.css",
                         "~/Content/DataTable/css/responsive.dataTables.min.css",
                         "~/Content/DataTable/css/buttons.dataTables.min.css",
                         "~/Content/fontawesome/css/all.css"));

            bundles.Add(new ScriptBundle("~/bundles/Plugins/js").Include(
                        "~/Content/DataTable/js/jquery.dataTables.min.js",
                        "~/Content/DataTable/js/dataTables.responsive.min.js",
                        "~/Content/DataTable/js/dataTables.buttons.min.js",
                        "~/Content/fontawesome/js/all.js"));
        }
    }
}
