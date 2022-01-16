function setup_visu4(js, arts_js, arts, top_artistes = undefined) {

  
  
  
  var json = js;
  var artistes_json = arts_js;
  var artistes = arts;// Listes des artistes à afficher
  //console.log(artistes);
  if (top_artistes !== undefined) {
    //console.log(json);
    artistes = artistesByTime(json, top = top_artistes);// On récupère le top des artistes les + écoutés
    const liste_art = new Set(artistes);
    //console.log(liste_art);
    json = json.filter(d => liste_art.has(d.artistName));
    //console.log(json);
    artistes_json = artistes_json.filter( d => {
      //console.log(d.artists.items[0].name);
      //console.log(liste_art.has(d.artists.items[0].name));
      return liste_art.has(d.artists.items[0].name);
    });
    
  }
  
  var genres = getGenres(artistes_json, false);
  var genres_ens = getGenresEns(artistes_json, false);
  /*console.log(genres_ens);
  console.log(artistes);*/
  genres_ens = Object.keys(genres_ens);

  const color = d3
    .scaleSequential()
    .domain([0, genres_ens.length - 1])
    .interpolator(d3.interpolateSinebow);

  var genre_artistes = {};

  for (var i in artistes_json) {
    //console.log(" --------------------- " + i + " --------------");
    var newEnsGenre = "";
    if (artistes_json[i].artists.items.length > 0) {
      var g = artistes_json[i].artists.items[0].genres;
      if (g.length == 0) {
        g = ["undefined"];
      }
      for (let ge in g)
        newEnsGenre += (g[ge]) + ",";
    }
    //console.log(artistes_json[i].artists.items[0].name);
    genre_artistes[artistes_json[i].artists.items[0].name] = newEnsGenre;
  }

  //console.log(genre_artistes);

  const group_genre = "genre";
  const group_artist = "artist";
  const node_genre_base = 2.5;
  //console.log(artistes);

  nodes = [];
  links = [];

  nodes_weights = [];
  //Initialisation
  genres.forEach(g => {
    nodes_weights[g] = 0;
  });



  artistes_json.forEach(j => {
    //console.log(j);
    if (j.artists.items.length > 0) {
      var genres2 = ["undefined"];
      if (j.artists.items[0].genres.length > 0)
        var genres2 = j.artists.items[0].genres;
      var name = j.artists.items[0].name;
      var popularity = j.artists.items[0].popularity;
      nodes.push({ id: name, group: group_artist, radius: popularity, idx: genres_ens.indexOf(genre_artistes[name]) });
      genres2.forEach(g2 => {
        nodes_weights[g2] += 1;
        links.push(
          { source: g2, target: name, value: 2 }
        );
      });
    }
  });
  //console.log(nodes_weights);


  genres.forEach(g => {
    nodes.push({ id: g, group: group_genre, radius: nodes_weights[g] * node_genre_base, idx: -1 });
  })
  var min = Math.min(...nodes.map(r => r.radius));
  var max = Math.max(...nodes.map(r => r.radius));
  var scale = d3.scaleLinear().domain([min, max]).range([8, 30]);
  for (let i in nodes) {
    nodes[i].radius = scale(nodes[i].radius);
  }
  //console.log(nodes.map(r => { console.log(r);return {name:r.id, pop:r.radius};}));
  /*
  console.log(nodes_weights);
  var min_genre = Math.min(...nodes_weights);
  console.log("min = " + min_genre);
  var max_genre = Math.max(...nodes_weights);
  console.log("max = " + max_genre);*/
  /*artistes.forEach(a => {
    nodes.push({id:a , group : group_artist  radius:});
  })*/



  //console.log(nodes);
  //console.log(links);


  var boo = true;
  artistes_json.forEach(j => {
    //if(boo)
    //console.log(j);
    boo = false;
  });
  var graph = { nodes: nodes, links: links };
  //console.log(graph);
  //console.log("???");
  var visu = ForceGraph(graph, {
    nodeId: (d) => { return d.id; },
    nodeGroup: (d) => { return d.group; },
    nodeTitle: d => `${d.id} (${d.group})`,
    color_artists: color,
    width: 1700,
    height: 900,
    linkStrength: 0.1
  });
  //console.log("!!!");

  //console.log(visu);
  var element = document.getElementById("visu4");
  element.appendChild(visu);
}