// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/pack
function Pack(
  data,
  {
    // data is either tabular (array of objects) or hierarchy (nested objects)
    path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
    id = Array.isArray(data) ? (d) => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
    parentId = Array.isArray(data) ? (d) => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
    children, // if hierarchical data, given a d in data, returns its children
    value, // given a node d, returns a quantitative value (for area encoding; null for count)
    sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
    label, // given a leaf node d, returns the display name
    title, // given a node d, returns its hover text
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    margin = 1, // shorthand for margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    padding = 3, // separation between circles
    fill = "#ddd", // fill for leaf circles
    fillOpacity, // fill opacity for leaf circles
    stroke = "#bbb", // stroke for internal circles
    strokeWidth, // stroke width for internal circles
    strokeOpacity, // stroke opacity for internal circles
    tooltip_infos
  } = {}
) {
  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root =
    path != null
      ? d3.stratify().path(path)(data)
      : id != null || parentId != null
        ? d3.stratify().id(id).parentId(parentId)(data)
        : d3.hierarchy(data, children);

  // Compute the values of internal nodes by aggregating from the leaves.
  value == null ? root.count() : root.sum((d) => Math.max(0, value(d)));

  // Compute labels and titles.
  const descendants = root.descendants();
  const leaves = descendants.filter((d) => !d.children);
  leaves.forEach((d, i) => (d.index = i));
  const L = label == null ? null : leaves.map((d) => label(d.data, d));
  const T = title == null ? null : descendants.map((d) => title(d.data, d));

  // Sort the leaves (typically by descending value for a pleasing layout).
  if (sort != null) root.sort(sort);

  // Compute the layout.
  d3
    .pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .padding(padding)(root);

  const svg = d3
    .create("svg")
    .attr("viewBox", [-marginLeft, -marginTop, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle");

  const node = svg
    .selectAll("a")
    .data(descendants)
    .join("a")
    .attr("xlink:href", link == null ? null : (d, i) => link(d.data, d))
    .attr("target", link == null ? null : linkTarget)
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  node
    .append("circle")
    .attr("fill", (d) => (d.children ? fill : d.data.col))
    .attr("fill-opacity", (d) => (d.children ? null : fillOpacity))
    .attr("stroke", (d) => (d.children ? stroke : null))
    .attr("stroke-width", (d) => (d.children ? strokeWidth : null))
    .attr("stroke-opacity", (d) => (d.children ? strokeOpacity : null))
    .attr("r", (d) => d.r)
    .on("mouseover", tooltip_infos.mouseover)
    .on("mousemove", tooltip_infos.mousemove)
    .on("mouseleave", tooltip_infos.mouseleave);


  if (T) node.append("title").text((d, i) => T[i]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    const leaf = node.filter(
      (d) => !d.children && d.r > 10 && L[d.index] != null
    );

    leaf
      .append("clipPath")
      .attr("id", (d) => `${uid}-clip-${d.index}`)
      .append("circle")
      .attr("r", (d) => d.r)

    leaf
      .append("text")
      .selectAll("tspan")
      .data((d) => `${L[d.index]}`.split(/\n/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
      .attr("fill-opacity", (d, i, D) => (i === D.length - 1 ? 0.7 : null))
      .text((d) => d);
  }


  return svg.node();
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/disjoint-force-directed-graph
function ForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links // an iterable of link objects (typically [{source, target}, …])
}, {
  nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
  nodeStroke = "#fff", // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 5, // node radius, in pixels
  nodeStrength,
  linkSource = ({ source }) => source, // given d in links, returns a node identifier string
  linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  color_artists,
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  margin = 1, // shorthand for margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  invalidation // when this promise resolves, stop the simulation
} = {}) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => {
    return ({ id: N[i], name: nodes[i].id, radius: nodes[i].radius,
       group: nodes[i].group , idx:nodes[i].idx});
  });
  links = d3.map(links, (_, i) => {
    return ({
      source: LS[i], target: LT[i], genre: links[i].source,
      artist: links[i].target, value: links[i].value
    });
  });
  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  // Construct the forces.
  d3
    .pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])

  const forceNode = d3.forceManyBody().strength(-200);
  const forceLink = d3.forceLink(links).id((d, i) => {
    return N[i];
  });
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink.strength(linkStrength);
  const simulation = d3.forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);
  const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle");
  const link = svg.append("g")
    .attr("stroke", linkStroke)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
    .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");
  if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
  var node = svg.append("g")
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => {
      return d.radius;
    })
    .call(drag(simulation));
  if (G) node.attr("fill", (d, i) => {
    if(d.group === "artist")
      return color_artists(d.idx);
    else
      return "#bbb";
      //return color(G[i]);
  });
  if (T) node.append("title").text(({ index: i }) => T[i]);

  var texts = svg.append('g')
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text(d=> {
    return d.name;
  });

  // Handle invalidation.
  if (invalidation != null) invalidation.then(() => simulation.stop());
  function intern(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }
  function ticked() {
    texts.attr("x" , d => d.x).attr("y" , d => d.y);
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  return Object.assign(svg.node(), { scales: { color } });
}


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function onlyUniqueDate(value, index, self) {
  return self.indexOf(value) === index;
}

Object.defineProperty(Array.prototype, 'shuffle', {
  value: function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  },
  configurable: true
});


function getArtistes(json, shuffle) {
  var artistes = [];
  for (var i in json) {
    artistes.push(json[i].artistName);
  }

  artistes = artistes.filter(onlyUnique);
  if (shuffle) artistes.shuffle();
  return artistes;
}

function getGenres(json, shuffle) {
  var genres = [];
  for (var i in json) {
    if (json[i].artists.items.length > 0) {
      var g = json[i].artists.items[0].genres;
      if (g.length == 0) {
        g = ["undefined"];
      }
      for (let ge in g)
        genres.push(g[ge]);
    }
  }

  genres = genres.filter(onlyUnique);
  if (shuffle) genres.shuffle();
  return genres;
}

function buildTooltip(visuId) {
  console.log(visuId);
  const tooltip = d3
    .select(visuId)
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseover = function (event, d) {
    console.log(event);
    if ((visuId === "#visu3")) {
      const artiste_name = d3.select(this.parentNode).datum().key;
      const ms_played = d.data[artiste_name];
      tooltip
        .html(
          "Artiste: " + artiste_name + "<br>" + "secondes écoutées: " + ms_played
        )
        .style("visibility", "visible");
    } else if (visuId === "#visu2") {
      if (!d.children && d.parent) {
        const artiste_name = d.parent.data.name;
        const track = d.data.track;
        const ms_played = d.data.msPlayed;
        tooltip
          .html(
            "Artiste : " + artiste_name + "<br>" + "secondes écoutées : " + Math.round(ms_played / 1000) + "<br>" + "Track : " + track

          )
          .style("visibility", "visible");

      }
    } else {
      const artiste_name = d.data.name;
      if (!(artiste_name === "visu")) {
        const ms_played = d.data.msPlayed;
        tooltip
          .html(
            "Artiste: " + artiste_name + "<br>" + "secondes écoutées: " + Math.round(ms_played / 1000)
          )
          .style("visibility", "visible");
      }

    }
  };
  const mousemove = function (e, d) {
    tooltip
      .style("transform", "translateY(-55%)")
      .style("left", e.pageX + "px")
      .style("top", e.pageY  - 60  + "px");
  };
  const mouseleave = function (event, d) {
    tooltip.style("visibility", "hidden");
  };

  return { "tooltip": tooltip, "mouseover": mouseover, "mousemove": mousemove, "mouseleave": mouseleave };
}

//js pour site
/*

function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
*/
/*var menucliquant = document.getElementById("menucliquant");
menucliquant.onclick = toggleFunction;*/

