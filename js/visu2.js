function setup_visu2(js, arts, top_artistes = undefined) {

  var json = js;
  var artistes = arts;// Listes des artistes à afficher
  if (top_artistes !== undefined) {
    artistes = artistesByTime(json, top = top_artistes);// On récupère le top des artistes les + écoutés
    const liste_art = new Set(artistes);
    json = json.filter(d => liste_art.has(d.artistName));
  }

  const color = d3
    .scaleSequential()
    .domain([0, artistes.length - 1])
    .interpolator(d3.interpolateSinebow);

  var tab = {};
  for (var i in json) {
    if (json[i].artistName in tab) {
      var tr = tab[json[i].artistName].find((d) => {
        return json[i].trackName === d.track;
      });
      if (tr === undefined) {
        tab[json[i].artistName].push({
          track: json[i].trackName,
          msPlayed: json[i].msPlayed,
          "col": color(artistes.indexOf(json[i].artistName))
        });
      } else {
        tr.msPlayed += json[i].msPlayed;
      }
    } else {
      tab[json[i].artistName] = [
        { track: json[i].trackName, msPlayed: json[i].msPlayed, "col": color(artistes.indexOf(json[i].artistName)) }
      ];
    }
  }
  var tab2 = [];
  for (var i in tab) {
    tab2.push({ name: i, children: tab[i], "col": color(artistes.indexOf(i)) });
  }
  var obj = { name: "visu", children: tab2 };
  const tooltip_infos = buildTooltip("#visu2");

  const tooltip = tooltip_infos.tooltip;
  var visu = Pack(obj, {
    value: (d) => d.msPlayed,
    label: (d, n) => {
      return d.track;
    },
    width: 1000,
    height: 800,
    tooltip_infos: tooltip_infos
  });
  var element = document.getElementById("visu1");
  element.appendChild(visu);
}