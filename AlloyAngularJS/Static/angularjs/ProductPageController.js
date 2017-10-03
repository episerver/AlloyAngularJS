angular.module("alloy").controller("productPageRelatedContentController", ["$window", "$http", function ($window, $http) {
    var vm = this;
    vm.model = $window.pageModel || {};

    // Helper method to get image URL and name through XHR and update pageImage properties.
    function updatePageImage(contentLink) {
        vm.model.pageImage = contentLink;
        $http.get("/ImageFile/Data?contentLink=" + contentLink).then(function (result) {
            vm.pageImageUrl = result.data.url;
            vm.pageImageName = result.data.name;
        });
    }

    // Helper method to only get the content id without version. This is useful as pages go from published to draft while updating a property, so the version changes from say "6_7" to "6_168".
    function contentId(contentLink) {
        return contentLink.split("_")[0];
    }

    // Set start values for image
    updatePageImage(vm.model.pageImage);


    // Wait until the window has loaded, and then hook up our property update logic.
    $window.addEventListener("load", function () {
        // Are we in OPE? Is there an epi communication object available?
        if (!$window.epi || !$window.epi.subscribe) {
            return;
        }

        // Outputing a message on window load so you can follow in the console and easier see if a full page reload was triggered.
        console.log("Window loaded!");

        // Subscribe to the contentSaved topic. Now the fun starts!
        // 'epi' is a global object created through communicationInjector.js, which is available as a .NET attribute [RequireClientResources] and Razor helper @Html.RequiredClientResources("Footer").
        $window.epi.subscribe("beta/contentSaved", function (details) {
            // "Is it me you're looking for?.."
            if (details.successful === false || contentId(details.contentLink) !== contentId(vm.model.contentLink)) {
                return;
            }

            // Outputing details so you can follow in the console.
            console.log("Content saved!", details);

            // Go through all the saved properties. Usually it's only one.
            details.properties.forEach(function (property) {
                switch (property.name) {
                    // Handle the page image property differently, because we only get the content reference but need more data for the page.
                    case "pageImage":
                        updatePageImage(property.value);
                        break;

                    // Otherwise just update the value on the model.
                    default:
                        vm.model[property.name] = property.value;
                        break;
                }
            });
        });
    });
}]);
