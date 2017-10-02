using EPiServer.Core;

namespace AlloyAngularJS.Models.Pages
{
    public interface IHasRelatedContent
    {
        ContentArea RelatedContentArea { get; }
    }
}
