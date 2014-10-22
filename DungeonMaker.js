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
            var Nroom = 15;
            var tileSize = 10;

            function isInArray(value, index, ar) {
                if (value == this)
                    return true;  //when calling, do some(isInArray, number)
            } //not functioning properly

            function dungButtonClicked(eventInfo) { //click is not being registered
                dwasClicked = true;
                //document.getElementById("text").innerText = "dungeon button pressed";

                var sizeChoice = document.getElementById("sizePick").value;
                // document.getElementById("totalTiles").innerText = sizeChoice;
                if (sizeChoice == "small") {
                    tileSize = 20;
                    tileLimit = 35;
                }
                else if (sizeChoice == "medium") {
                    tileSize = 15;
                    tileLimit = 50;
                }

                else {
                    tileSize = 10;
                    tileLimit = 75;
                }

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
                var currentY = dungMap.clientHeight / 4;
                var tempX, tempY, Nrand;

                tile.fillRect(currentX, currentY, tileSize, tileSize);
                tileOut.strokeRect(currentX, currentY, tileSize, tileSize);
                Xarr[0] = currentX;
                Yarr[0] = currentY;

                while (tileCounter < tileLimit) {
                    switch (Math.round((Math.random() * 100)) % 4) { 
                        case 0: { tempX = currentX + tileSize; tempY = currentY; break; }
                        case 1: { tempX = currentX - tileSize; tempY = currentY; break; }
                        case 2: { tempX = currentX; tempY = currentY + tileSize; break; }
                        case 3: { tempX = currentX; tempY = currentY - tileSize; break; }
                    }
                    //position of next tile updated

                    if (tempX >= 12 && tempX <= (dungMap.clientWidth-5) && tempY >= 12 && tempY <= (dungMap.clientHeight-5) &&
                        (!(Xarr.some(isInArray, tempX)) || !(Yarr.some(isInArray, tempY)))) {
                        tile.fillRect(tempX, tempY, tileSize, tileSize);
                        tileOut.strokeRect(tempX, tempY, tileSize, tileSize);
                        Xarr.push(tempX);
                        Yarr.push(tempY);
                        currentX = tempX;
                        currentY = tempY;
                        tileCounter++;
                    }
                    else {
                        Nrand = Math.round(Math.random() * (Xarr.length - 1));
                        currentX = Xarr[Nrand];
                        currentY = Yarr[Nrand];
                    }
                }
                if (sizeChoice == "large")
                    tileLimit = 120;

                for (var r = 0; r < tileLimit / 2; r++) {
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
                    //document.getElementById("totalTiles").innerText = checkbox.checked;
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
      //  var installDir = Windows.ApplicationModel.Package.current.installedLocation;
       // var picker = new Windows.Storage.Pickers.FileSavePicker();

      //  picker.defaultFileExtension = "jpg";

       // Windows.Storage.StorageFolder.getFolderFromPathAsync(encodeURI("ms-appx:///images/")).done(
        //    function (folder) {
                //opened the folder so do stuff
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
            


      //      }
      //  );

  
        }
        
       

})();
