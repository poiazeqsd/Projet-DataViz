
var json, artistes, artistes_json;

Promise.all([d3.json("data/StreamingHistory0.json"), d3.json("data/artists.json")])
    .then(function (files) {
        json = files[0];
        artistes_json = files[1];
        artistes = getArtistes(json, false);


        setup_visu1(json, artistes, top_artistes = undefined);
        //setup_visu2(json, artistes, top_artistes = undefined);
        setup_visu3(json, artistes, top_artistes = undefined);
        setup_visu4(json, artistes_json, artistes, top_artistes = undefined);
    })
    .catch(function (err) {
    });

function selectAff(id, value) {
    var top_artistes = undefined;
    if (["3", "4"].includes(value)) {
        top_artistes = 10;
    } else if (["5", "6"].includes(value)) {
        top_artistes = 20;
    } else if (["7", "8"].includes(value)) {
        top_artistes = 50;
    } else if (value !== "undefined" && !(["1", "2"].includes(value))) {
        console.log("salut");
        top_artistes = parseInt(value);
    }

    if (id === "select1") {
        var element = document.getElementById("visu1");
        console.log("select 1 -- " + value);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        var visu_id = parseInt(value) % 2;
        if (visu_id == 0) {
            setup_visu2(json, artistes, top_artistes);
        } else {

            setup_visu1(json, artistes, top_artistes);
        }
    } else if (id === "select2") {
        var element = document.getElementById("visu2");

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        setup_visu2(json, artistes, top_artistes);
    } else if (id === "select3") {
        console.log("select 3 -- " + value);
        var element = document.getElementById("visu3");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        setup_visu3(json, artistes, top_artistes);
    } else if (id === "select4") {
        console.log("select 4 -- " + value);
        var element = document.getElementById("visu4");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        setup_visu4(json, artistes_json, artistes, top_artistes);
    }

}