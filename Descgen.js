// This Source Code Form is subject to the terms of 
// the Mozilla Public License, v. 2.0. 
// If a copy of the MPL was not distributed with this file,
// You can obtain one at http://mozilla.org/MPL/2.0/.
(function () {
    "use strict";

  //  var app = WinJS.Application;
  //  var activation = Windows.ApplicationModel.Activation;

    WinJS.UI.Pages.define("/pages/item/Descgen.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = Data.resolveItemReference(options.item);
            element.querySelector(".titlearea .desctitle").textContent = item.title;

            var npcopt = document.getElementById("NPCOption").addEventListener("click", npcOption, false);
            var roomopt = document.getElementById("RoomOption").addEventListener("click", roomOption, false);
            var readButton = document.getElementById("Generate").addEventListener("click", readText, false);
            document.getElementById("raceChoice").disabled = true;
            document.getElementById("roomChoice").disabled = true;

            // TODO: Initialize the page here.
            var Human = new Array();
            var Dwarf = new Array();
            var Elf = new Array();
            var Gnome = new Array();
            var Orc = new Array();
            var Halfling = new Array();
            var HumanL = new Array(); //L = last name
            var DwarfL = new Array();
            var ElfL = new Array();
            var GnomeL = new Array();
            var OrcL = new Array();
            var HalflingL = new Array();
            var Personality = new Array();
            var NDescription = new Array();
            var Cavern = new Array();
            var Lair = new Array();
            var Noble = new Array();
            var Wizard = new Array();
            var Tavern = new Array();

            function npcOption(eventInfo) {
                document.getElementById("raceChoice").disabled = false;
                document.getElementById("roomChoice").disabled = true;
            }

            function roomOption(eventInfo) {
                document.getElementById("raceChoice").disabled = true;
                document.getElementById("roomChoice").disabled = false;
            }

            function readText() {
                var file = document.getElementById("fileInput").files[0];
                // var picker = Windows.Storage.KnownFolders.documentsLibrary;
                //  picker.getFileAsync("Descgen.txt").then(function (file) {
                if (file) {
                    var fileReader = new FileReader();
                    fileReader.onload = fileLoaded;
                    // fileReader.onerror = fileError;

                    fileReader.readAsText(file);


                }
                function fileLoaded(evt) {
                    var output = evt.target.result;
                    var totalInd = 0, start = 0, key, midInd = 0, entry, randNum;
                    while (totalInd < output.length) {
                        if (output.charAt(totalInd) == ":") midInd = totalInd;
                        if (output.charAt(totalInd) == "&") {
                            entry = output.substring(midInd + 1, totalInd);
                            key = output.substring(start, midInd);
                            if (key == "Human") Human.push(entry);
                            if (key == "Dwarf") Dwarf.push(entry);
                            if (key == "Elf") Elf.push(entry);
                            if (key == "Gnome") Gnome.push(entry);
                            if (key == "Orc") Orc.push(entry);
                            if (key == "Halfling") Halfling.push(entry);
                            if (key == "HumanL") HumanL.push(entry);
                            if (key == "DwarfL") DwarfL.push(entry);
                            if (key == "ElfL") ElfL.push(entry);
                            if (key == "GnomeL") GnomeL.push(entry);
                            if (key == "OrcL") OrcL.push(entry);
                            if (key == "HalflingL") HalflingL.push(entry);
                            if (key == "Personality") Personality.push(entry);
                            if (key == "Description") NDescription.push(entry);
                            if (key == "Cavern") Cavern.push(entry);
                            if (key == "Lair") Lair.push(entry);
                            if (key == "Wizard") Wizard.push(entry);
                            if (key == "Noble") Noble.push(entry);
                            if (key == "Tavern") Tavern.push(entry);

                            start = totalInd + 1;
                        }
                        totalInd++;
                    }
                    if (!document.getElementById("raceChoice").disabled) {
                        var race, name, desc = "";
                        var raceSelect = document.getElementById("raceChoice").value;
                        randNum = Math.round(Math.random() * 5);

                        if (raceSelect == "Human" || (raceSelect == "Random" && randNum == 0)) {
                            race = "Human";
                            name = Human[Math.round(Math.random() * (Human.length - 1))] + " " + HumanL[Math.round(Math.random() * (HumanL.length - 1))];
                        }
                        else if (raceSelect == "Dwarf" || (raceSelect == "Random" && randNum == 1)) {
                            race = "Dwarf";
                            name = Dwarf[Math.round(Math.random() * (Dwarf.length - 1))] + " " + DwarfL[Math.round(Math.random() * (DwarfL.length - 1))];
                        }
                        else if (raceSelect == "Elf" || (raceSelect == "Random" && randNum == 2)) {
                            race = "Elf";
                            name = Elf[Math.round(Math.random() * (Elf.length - 1))] + " " + ElfL[Math.round(Math.random() * (ElfL.length - 1))];
                        }
                        else if (raceSelect == "Gnome" || (raceSelect == "Random" && randNum == 3)) {
                            race = "Gnome";
                            name = Gnome[Math.round(Math.random() * (Gnome.length - 1))] + " " + GnomeL[Math.round(Math.random() * (GnomeL.length - 1))];
                        }
                        else if (raceSelect == "Orc" || (raceSelect == "Random" && randNum == 4)) {
                            race = "Orc";
                            name = Orc[Math.round(Math.random() * (Orc.length - 1))] + " " + OrcL[Math.round(Math.random() * (OrcL.length - 1))];
                        }
                        else if (raceSelect == "Halfling" || (raceSelect == "Random" && randNum == 5)) {
                            race = "Halfling";
                            name = Dwarf[Math.round(Math.random() * (Dwarf.length - 1))] + " " + DwarfL[Math.round(Math.random() * (DwarfL.length - 1))];
                        }


                        for (var num = 0; num < 3; num++) {
                            randNum = Math.round(Math.random() * (NDescription.length));
                            desc = desc + "\n" + " - " + NDescription[randNum];
                        }

                        document.getElementById("output1").innerText = "Race: " + race;
                        document.getElementById("output2").innerText = "Name: " + name;
                        document.getElementById("output3").innerText = "Personality: " + Personality[Math.round(Math.random() * (Personality.length - 1))];
                        document.getElementById("output4").innerText = "Description: " + desc;
                    }
                    else if (!document.getElementById("roomChoice").disabled) {
                        document.getElementById("output3").innerText = "";
                        document.getElementById("output4").innerText = "";
                        var room, desc;
                        var roomSelect = document.getElementById("roomChoice").value;

                        var randNum = Math.round(Math.random() * 4);
                        if (roomSelect == "Cavern" || (roomSelect == "Random" && randNum == 0)) { room = "Cavern"; desc = Cavern[Math.round(Math.random() * (Cavern.length - 1))]; }
                        else if (roomSelect == "Lair" || (roomSelect == "Random" && randNum == 1)) { room = "Enemy's Lair"; desc = Lair[Math.round(Math.random() * (Lair.length - 1))]; }
                        else if (roomSelect == "Noble" || (roomSelect == "Random" && randNum == 2)) { room = "Noble Building"; desc = Noble[Math.round(Math.random() * (Noble.length - 1))]; }
                        else if (roomSelect == "Wizard" || (roomSelect == "Random" && randNum == 3)) { room = "Wizard's Abode"; desc = Wizard[Math.round(Math.random() * (Wizard.length - 1))]; }
                        else if (roomSelect == "Tavern" || (roomSelect == "Random" && randNum == 4)) { room = "Tavern"; desc = Tavern[Math.round(Math.random() * (Tavern.length - 1))]; }

                        document.getElementById("output1").innerText = "Room type: " + room;
                        document.getElementById("output2").innerText = "Room description: " + desc;
                    }


                    return true;
                }


            }
        }
    });
    
})();
