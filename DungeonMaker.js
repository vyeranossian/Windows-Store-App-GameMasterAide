/*This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, 
You can obtain one at http://mozilla.org/MPL/2.0/.
*/

(function () {
    "use strict";

   // var app = WinJS.Application;
   // var activation = Windows.ApplicationModel.Activation;

    WinJS.UI.Pages.define("/pages/item/DungeonMaker.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = Data.resolveItemReference(options.item);
            element.querySelector(".titlearea .DMtitle").textContent = item.title;

            var dunButton = document.getElementById("dungButton");
            dunButton.addEventListener("click", dungButtonClicked, false);

            var itButton = document.getElementById("itemButton");
            itButton.addEventListener("click", itemButtonClicked, false);

            var savButton = document.getElementById("saveButton");
            savButton.addEventListener("click", saveButtonClicked, false);

            var tileCounter, rmCent, tileLimit;
            var dwasClicked = new Boolean;
            dwasClicked = false;
            var itemWasClicked = false;
            var Xarr = new Array();
            var Yarr = new Array();
            var Xroom = new Array();
            var Yroom = new Array();
            var itemXArr = new Array();
            var itemYArr = new Array();
            var Nroom, divis, str, update = 5;
            var tileSize = 10;

            function isAFilledCell(X, Y, xvalue, yvalue) { //each index refers to a filled coordinate (Xarr[index], Yarr[index])
                for (var index = 0; index < X.length; index++) {
                    if (X[index] == xvalue && Y[index] == yvalue) //check if (xvalue,yvalue) is a filled coordinate
                        return true;
                }
                return false;
            }

            function dungButtonClicked(eventInfo) {
                dwasClicked = true;

                var sizeChoice = document.getElementById("sizePick").value;
                if (sizeChoice == "small") {
                    tileSize = 20;
                    tileLimit = 50;
                    Nroom = 10;
                    str = 8; 
                }
                else if (sizeChoice == "medium") {
                    tileSize = 15;
                    tileLimit = 90;
                    str = 10;
                    Nroom = 20;
                }

                else {
                    tileSize = 10;
                    tileLimit = 150;
                    str = 15;
                    Nroom = 30;
                }

                var branChoice = document.getElementById("degBranch").value;
                if (branChoice == "little")
                    str *= 2;
                else if (branChoice == "high")
                    str *= 0.5;
           

                var roomChoice = document.getElementById("roomStyle").value;
                if (roomChoice == "few")
                    divis = 10;
                else if (roomChoice == "many")
                    divis = 5;
                else divis = 2;

                itemXArr = [];
                itemYArr = [];

                //Generate the dungeon map
                var dungMap = document.getElementById("dungeonMap");
                var tile = dungMap.getContext("2d");
                var tileOut = dungMap.getContext("2d");

                tile.clearRect(0, 0, 1000, 1000);
                Xarr = [];
                Yarr = [];
                tileCounter = 1;

                tile.fillStyle = "white";
                tileOut.strokeStyle = "black";

                var currentX = dungMap.clientWidth/2;
                var currentY = dungMap.clientHeight/4;
                var tempX, tempY, Nrand;
                var Naccept = Math.round(Math.random() * 12);

                tile.fillRect(currentX, currentY, tileSize, tileSize);
                tileOut.strokeRect(currentX, currentY, tileSize, tileSize);
                Xarr[0] = currentX;
                Yarr[0] = currentY;

                while (tileCounter < tileLimit) { //this while loop deals with making the dungeon hallways (the map's backbone)
                    switch (Naccept % 4) {
                        case 0: { tempX += tileSize; break; }
                        case 1: { tempX -= tileSize; break; }
                        case 2: { tempY += tileSize; break; }
                        case 3: { tempY -= tileSize; break; }
                    }
                    //position of next tile updated
                    if (!isAFilledCell(Xarr, Yarr, tempX, tempY)) { //checks to see if (tempX, tempY) is a filled location
                        if (tempX >= 12 && tempX <= dungMap.clientWidth-20 && tempY >= 12 && tempY <= dungMap.clientHeight-20) {
                            tile.fillRect(tempX, tempY, tileSize, tileSize);
                            tileOut.strokeRect(tempX, tempY, tileSize, tileSize);
                            Xarr.push(tempX);
                            Yarr.push(tempY);
                            currentX = tempX;
                            currentY = tempY;
                            tileCounter++;
                            if (update > str) //controls how much hallway branching occurs, high str means less branching
                                Naccept = Math.round(Math.random() * 12);
                            update++;
                        }
                        else {
                            Nrand = Math.round(Math.random() * (Xarr.length - 1));
                            currentX = Xarr[Nrand];
                            currentY = Yarr[Nrand];
                            update = 1;
                            tempX = currentX;
                            tempY = currentY;
                            switch (Math.round(Math.random() * 3)) {
                                case 0: { Naccept = 0; break; }
                                case 1: { Naccept = 1; break; }
                                case 2: { Naccept = 2; break; }
                                case 3: { Naccept = 3; break; }
                            }

                        }
                    }
                }

                    for (var r = 0; r < tileLimit / divis; r++) {
                        rmCent = Math.round(Math.random() * (Xarr.length - 1));
                        tempX = Xarr[rmCent];
                        tempY = Yarr[rmCent];

                        switch (Math.round(Math.random() * 8)) {
                            case 0: { tempX += tileSize; break; }
                            case 1: { tempX -= tileSize; break; }
                            case 2: { tempY += tileSize; break; }
                            case 3: { tempY -= tileSize; break; }
                            case 4: { tempX += tileSize; tempY += tileSize; break; }
                            case 5: { tempX -= tileSize; tempY += tileSize; break; }
                            case 6: { tempX += tileSize; tempY -= tileSize; break; }
                            case 7: { tempX -= tileSize; tempY -= tileSize; break; }
                            case 8: break;
                        }
                        //randomly pick a part of the room to be the center

                        Xroom.push(tempX);
                        Yroom.push(tempY);
                        for (var xind = tempX - tileSize; xind <= tempX + tileSize; xind += tileSize) {
                            for (var yind = tempY - tileSize; yind <= tempY + tileSize; yind += tileSize) {
                                Xarr.push(xind);
                                Yarr.push(yind);
                                tile.fillRect(xind, yind, tileSize, tileSize);
                                tileOut.strokeRect(xind, yind, tileSize, tileSize);

                            }
                        }

                    }

                
            }
                var dungMap = document.getElementById("dungeonMap");

                function itemButtonClicked(eventInfo) {
                    itemWasClicked = true;

                    var dungMap = document.getElementById("dungeonMap");
                    var trap = dungMap.getContext("2d");
                    var treas = dungMap.getContext("2d");
                    var enc = dungMap.getContext("2d");

                    for (var it = 0; it <= itemXArr.length; it++) {
                        trap.fillStyle = "white";
                        trap.fillRect(itemXArr[it] - 1, itemYArr[it] - 1, tileSize / 1.5, tileSize / 1.5);
                    }
                    //clear old items
                    itemXArr = [];
                    itemYArr = [];

                    //traps & treasure
                    WinJS.Utilities.query(".DungeonBox").forEach(function (checkbox) {
                        if (checkbox.id == "traps" && checkbox.checked) {

                            var Ntrap = Math.round(Math.random() * (Nroom / 3));
                            trap.fillStyle = "red";
                            for (var ntp = 0; ntp <= Ntrap; ntp++) {
                                rmCent = Math.round(Math.random() * (Xarr.length - 1));
                                trap.fillRect(Xarr[rmCent] + tileSize / 4, Yarr[rmCent] + tileSize / 4, tileSize / 1.5 - 2, tileSize / 1.5 - 2);
                                itemXArr.push(Xarr[rmCent] + tileSize / 4);
                                itemYArr.push(Yarr[rmCent] + tileSize / 4);
                            }

                        }
                        if (checkbox.id == "treasure" && checkbox.checked) {
                            var Ntreas = Math.round(Math.random() * (Nroom / 4));
                            treas.fillStyle = "purple";
                            for (var nts = 0; nts <= Ntreas; nts++) {
                                rmCent = Math.round(Math.random() * (Xarr.length - 1));
                                treas.fillRect(Xarr[rmCent] + tileSize / 4, Yarr[rmCent] + tileSize / 4, tileSize / 1.5 - 2, tileSize / 1.5 - 2);
                                itemXArr.push(Xarr[rmCent] + tileSize / 4);
                                itemYArr.push(Yarr[rmCent] + tileSize / 4);
                            }
                        }

                        if (checkbox.id == "encounter" && checkbox.checked) {
                            var Nenc = Math.round(Math.random() * (Nroom / 2));
                            enc.fillStyle = "green";
                            for (var nenc = 0; nenc <= Nenc; nenc++) {
                                rmCent = Math.round(Math.random() * (Xarr.length - 1));
                                enc.fillRect(Xarr[rmCent] + tileSize / 4, Yarr[rmCent] + tileSize / 4, tileSize / 1.5 - 2, tileSize / 1.5 - 2);
                                itemXArr.push(Xarr[rmCent] + tileSize / 4);
                                itemYArr.push(Yarr[rmCent] + tileSize / 4);
                            }

                        }


                    });
                }

            }
        
    });



    function saveButtonClicked(eventInfo) { //WORKING
        //var imgData = 
        var mapFileName = "dungeonMap.jpg";
        var dungMap = document.getElementById("dungeonMap");
        var pics = Windows.Storage.KnownFolders.picturesLibrary; //output stream for file
        var mapContents, imgData;
        var Imaging = Windows.Graphics.Imaging;
       
         //creating the file
         pics.createFileAsync(mapFileName, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file){
           if (file)
             return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
           }).then(function (stream) {
           //get canvas data
            
           mapContents = dungMap.getContext("2d");
           imgData = mapContents.getImageData(0, 0, dungMap.width, dungMap.height);

           return Imaging.BitmapEncoder.createAsync(Imaging.BitmapEncoder.jpegEncoderId, stream);
           }).then(function (encoder) {
            //set pixel data in encoder
           encoder.setPixelData(Imaging.BitmapPixelFormat.rgba8, Imaging.BitmapAlphaMode.straight, dungMap.width, dungMap.height, 96, 96, new Uint8Array(imgData.data));

            //encode
           return encoder.flushAsync();
           }).then(null, function (error) {});
  
        }
        
       

})();
