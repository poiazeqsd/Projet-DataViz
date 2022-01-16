
const map_id_visus = new Map();

map_id_visus.set("1", ["visu1"]);
map_id_visus.set("2", ["visu2"]);
map_id_visus.set("3", ["visu3"]);
map_id_visus.set("4", ["visu4"]);
function affichage(d) {
  var x = document.getElementById("visu-select");
  map_id_visus.forEach((k, v) => {
    k.forEach((s) => {
      if (v === x.value) {
        $("#" + s).show();
      } else {
        $("#" + k).hide();
      }
    });
  });
}



const tab = [1, 2, 3, 4];

for (let i in tab) {
  var x = document
    .getElementById("select" + tab[i])
    .addEventListener("change", (d) => {
      selectAff(d.target.id, d.target.value);
    });
}

/*Promise.all([d3.json("StreamingHistory0.json"), d3.json("artists.json")])
                .then(function (files) {
                })
                .catch(function (err) {
                });*/