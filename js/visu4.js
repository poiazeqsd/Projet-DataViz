function setup_visu4(json, artistes_json, artistes , genres) {


  const color = d3
  .scaleSequential()
  .domain([0, artistes.length - 1])
  .interpolator(d3.interpolateSinebow);
    
    const group_genre = "genre";
    const group_artist = "artist";
    const node_genre_base = 2.5;
    //console.log(artistes);

    nodes = [];
    links = [];

    nodes_weights = [];
    //Initialisation
    genres.forEach( g =>{
      nodes_weights[g] = 0;
    });



    artistes_json.forEach( j =>{
      //console.log(j);
      if(j.artists.items.length >0){
        var genres2 = ["undefined"];
        if(j.artists.items[0].genres.length >0)
          var genres2  = j.artists.items[0].genres;
        var name = j.artists.items[0].name;
        var popularity = j.artists.items[0].popularity;
        nodes.push({id:name , group : group_artist , radius: popularity, idx:artistes.indexOf(name)});
        genres2.forEach( g2 => {
          nodes_weights[g2] += 1;
          links.push(
            {source:g2, target:name, value:2}
            );
          });
      }
    });
    //console.log(nodes_weights);
    

    genres.forEach(g => {
      nodes.push({id:g , group : group_genre , radius:nodes_weights[g] * node_genre_base, idx:-1});
    })
    var min = Math.min(...nodes.map(r => r.radius));
    var max = Math.max(...nodes.map(r => r.radius));
    var scale = d3.scaleLinear().domain([min, max]).range([8,30]);
    for (let i in nodes){
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
    artistes_json.forEach( j => {
          //if(boo)
          //console.log(j);
          boo = false;
    });
    var graph = {nodes:nodes, links:links};
    //console.log(graph);
    //console.log("???");
    var visu = ForceGraph(graph, {
      nodeId: (d) =>{ return d.id;},
      nodeGroup: (d) => { return d.group;},
      nodeTitle: d => `${d.id} (${d.group})`,
      color_artists : color,
      width: 1300,
      height: 1200,
    });
    //console.log("!!!");

    //console.log(visu);
    var element = document.getElementById("visu4");
    element.appendChild(visu);
  }