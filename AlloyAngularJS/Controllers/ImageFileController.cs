using System.Web.Mvc;
using AlloyAngularJS.Models.Media;
using AlloyAngularJS.Models.ViewModels;
using EPiServer;
using EPiServer.Core;
using EPiServer.Web.Mvc;
using EPiServer.Web.Routing;

namespace AlloyAngularJS.Controllers
{
    /// <summary>
    /// Controller for the image file.
    /// </summary>
    public class ImageFileController : PartialContentController<ImageFile>
    {
        private readonly UrlResolver _urlResolver;
        private readonly IContentLoader _contentLoader;

        public ImageFileController(UrlResolver urlResolver, IContentLoader contentLoader)
        {
            _urlResolver = urlResolver;
            _contentLoader = contentLoader;
        }

        /// <summary>
        /// The index action for the image file. Creates the view model and renders the view.
        /// </summary>
        /// <param name="currentContent">The current image file.</param>
        public override ActionResult Index(ImageFile currentContent)
        {
            var model = new ImageViewModel
            {
                Url = _urlResolver.GetUrl(currentContent.ContentLink),
                Name = currentContent.Name,
                Copyright = currentContent.Copyright
            };

            return PartialView(model);
        }

        /// <summary>
        /// Gets image data. Used by Angular controllers to update the page without a page reload.
        /// </summary>
        /// <param name="contentLink">The content reference to the image.</param>
        /// <returns>An object with the name and URL of the image.</returns>
        public JsonResult Data(ContentReference contentLink)
        {
            var image = _contentLoader.Get<ImageFile>(contentLink);

            return Json(new
                {
                    name = image.Name,
                    url = _urlResolver.GetUrl(contentLink)
                },
                JsonRequestBehavior.AllowGet);
        }
    }
}
