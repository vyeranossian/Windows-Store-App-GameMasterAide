// This Source Code Form is subject to the terms of 
// the Mozilla Public License, v. 2.0. 
// If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.
(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var session = WinJS.Application.sessionState;
    var util = WinJS.Utilities;

    // Get the groups used by the data-bound sections of the Hub.
    var section3Group = Data.resolveGroupReference("itemgroup");
    var section3Items = Data.getItemsFromGroup(section3Group);

    WinJS.UI.Pages.define("/pages/hub/hub.html", {
        processed: function (element) {
            return WinJS.Resources.processAll(element);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var hub = element.querySelector(".hub").winControl;
            hub.onheaderinvoked = function (args) {
                args.detail.section.onheaderinvoked(args);
            };
            hub.onloadingstatechanged = function (args) {
                if (args.srcElement === hub.element && args.detail.loadingState === "complete") {
                    hub.onloadingstatechanged = null;
                }
            }

            // TODO: Initialize the page here.
                var picfold = Windows.Storage.KnownFolders.picturesLibrary;
                picfold.getFileAsync("dungeonMap.jpg").then(function (file) {
                    var dungURL = window.URL.createObjectURL(file, { oneTimeOnly: true });
                    document.getElementById("savedDungMap").src = dungURL;
                    });
         
        },

        section3DataSource: section3Items.dataSource,

        section3HeaderNavigate: util.markSupportedForProcessing(function (args) {
            nav.navigate("/pages/section/section.html", { title: args.detail.section.header, groupKey: section3Group.key });
        }),

        section3ItemNavigate: util.markSupportedForProcessing(function (args) { 
            var item = Data.getItemReference(section3Items.getAt(args.detail.itemIndex));
            if (item[1] == "Dungeon Maker")
                nav.navigate("/pages/item/DungeonMaker.html", { item: item });
            else if (item[1] == "Description Generator")
                nav.navigate("/pages/item/Descgen.html", { item: item });
        }),

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
    });
})();
