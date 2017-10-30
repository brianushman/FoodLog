using ImageProcessor;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodLog.Controllers
{
    public class FilesController : Controller
    {
        // GET: Files
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult UploadFiles()
        {
            UserFile r = null;

            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpf = Request.Files[file] as HttpPostedFileBase;
                if (hpf.ContentLength == 0)
                    continue;

                using (var imageStream = new MemoryStream())
                {
                    hpf.InputStream.CopyTo(imageStream);

                    System.Drawing.Size imageResolution = System.Drawing.Image.FromStream(imageStream).Size;

                    using (MemoryStream outStream = new MemoryStream())
                    {
                        int resizeWidth = imageResolution.Width > 1000 ? 1000 : imageResolution.Width;
                        /*using (ImageFactory imageFactory = new ImageFactory(true))
                        {
                            imageFactory.Load(imageStream).Resize(new System.Drawing.Size(resizeWidth, 0)).Save(outStream);
                        }*/

                        r = new UserFile()
                        {
                            Name = Path.GetFileNameWithoutExtension(hpf.FileName),
                            Type = hpf.ContentType,
                            Created = DateTime.Now,
                            Data = Convert.ToBase64String(imageStream.ToArray()),
                            UserId = User.Identity.Name
                        };
                    }
                }
            }

            //return Json(new { fileInfo = r }, "text/html");
            return new JsonResult()
            {
                Data = new { fileInfo = r },
                MaxJsonLength = Int32.MaxValue
            };
        }
    }

    public class UserFile
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public DateTime Created { get; set; }
        public string Data { get; set; }
        public string UserId { get; set; }

        //[ElasticProperty(OptOut = true)]
        //public string Thumbnail { get; set; }
    }
}