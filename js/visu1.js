function setup_visu1(js, arts, top_artistes = undefined) {


  var json = js;
  var artistes = arts;// Listes des artistes à afficher
  //console.log(artistes);
  if (top_artistes !== undefined) {
    artistes = artistesByTime(json, top = top_artistes);// On récupère le top des artistes les + écoutés
    const liste_art = new Set(artistes);
    //console.log(liste_art);
    json = json.filter(d => liste_art.has(d.artistName));
  }
  //console.log(artistes);



  const color = d3
    .scaleSequential()
    .domain([0, artistes.length - 1])
    .interpolator(d3.interpolateSinebow);

  var tab = {};
  for (var i in json) {
    var artistName = json[i].artistName;
    //console.log(artistName);
    //console.log(artistes.has(artistName));
    //if(liste_art.has(artistName)){
    //console.log(artistName );
    if (artistName in tab) {
      tab[artistName] += json[i].msPlayed;
    } else {
      tab[artistName] = json[i].msPlayed;
    }
    //}
  }

  var tab2 = [];
  for (var i in tab) {
    tab2.push({ name: i, msPlayed: tab[i], "col": color(artistes.indexOf(i)) });
  }
  var obj = { name: "visu", children: tab2 };

  const tooltip_infos = buildTooltip("#visu1");


  var visu = Pack(obj, {
    value: (d) => d.msPlayed,
    label: (d, n) => d.name,
    width: 1000,
    height: 800,
    tooltip_infos: tooltip_infos
  });
  var element = document.getElementById("visu1");
  element.appendChild(visu);
}