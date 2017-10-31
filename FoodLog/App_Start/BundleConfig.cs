using System.Web;
using System.Web.Optimization;

namespace FoodLog
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/knockout-{version}.js",
                        "~/Scripts/knockout.mapping.js",
                        "~/Scripts/moment.min.js",
                        "~/Scripts/bootstrap-datepicker.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-fileupload").Include(
                        "~/Scripts/fileupload/jqueryui/jquery.ui.widget.js",
                        "~/Scripts/fileupload/load-image.all.min.js",
                        "~/Scripts/fileupload/canvas-to-blob.min.js",
                        "~/Scripts/fileupload/jquery.iframe-transport.js",
                        "~/Scripts/fileupload/jquery.fileupload.js",
                        "~/Scripts/fileupload/jquery.fileupload-process.js",
                        "~/Scripts/fileupload/jquery.fileupload-image.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-fileupload-IE9").Include(
                        "~/Scripts/fileupload/cors/jquery.xdr-transport.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/bootbox.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/appcode").Include(
                      "~/Scripts/application.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/jquery.fileupload.css",
                      "~/Content/font-awesome.min.css",
                      "~/Content/bootstrap-datepicker.min.css",
                      "~/Content/site.css"));
        }
    }
}
