
var json, artistes, artistes_json;

Promise.all([d3.json("data/StreamingHistory0.json"), d3.json("data/artists.json")])
    .then(function (files) {
        json = files[0];
        artistes_json = files[1];
        artistes = getArtistes(json, false);

        //console.log(tamer);

        setup_visu1(json, artistes, top_artistes = undefined);
        setup_visu2(json, artistes, top_artistes = undefined);
        setup_visu3(json, artistes, top_artistes = undefined);
        setup_visu4(json, artistes_json, artistes, top_artistes = undefined);
    })
    .catch(function (err) {
    });

function selectAff(id, value) {
    console.log(id + " ---- " + value);
    var top_artistes = (value === "undefined") ? undefined : parseInt(value);
    console.log(top_artistes);
    
    if(id === "select1"){
        console.log("a");
        var element = document.getElementById("visu1");
        while( element.firstChild) {
            // La liste n'est pas une copie, elle sera donc réindexée à chaque appel
            element.removeChild( element.firstChild);
        }
        setup_visu1(json, artistes, top_artistes );
    } else if(id === "select2"){
        console.log("b");
        var element = document.getElementById("visu2");

        while( element.firstChild) {
            // La liste n'est pas une copie, elle sera donc réindexée à chaque appel
            element.removeChild( element.firstChild);
        }
        setup_visu2(json, artistes, top_artistes );
    } else if(id === "select3"){
        console.log("cc");
        var element = document.getElementById("visu3");
        while( element.firstChild) {
            // La liste n'est pas une copie, elle sera donc réindexée à chaque appel
            element.removeChild( element.firstChild);
        }
        setup_visu3(json, artistes, top_artistes );
    } else if(id === "select4"){
        console.log("d");
        var element = document.getElementById("visu4");
        while( element.firstChild) {
            // La liste n'est pas une copie, elle sera donc réindexée à chaque appel
            element.removeChild( element.firstChild);
        }
        setup_visu4(json, artistes_json, artistes, top_artistes );
    }

}