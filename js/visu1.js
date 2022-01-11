function setup_visu1(json, artistes) {


    const color = d3
      .scaleSequential()
      .domain([0, artistes.length - 1])
      .interpolator(d3.interpolateSinebow);

    var tab = {};
    for (var i in json) {
      if (json[i].artistName in tab) {
        tab[json[i].artistName] += json[i].msPlayed;
      } else {
        tab[json[i].artistName] = json[i].msPlayed;
      }
    }
  
    var tab2 = [];
    for (var i in tab) {
      tab2.push({ name: i, msPlayed: tab[i] , "col" : color(artistes.indexOf(i))});
    }
    var obj = { name: "visu", children: tab2 };

    const tooltip_infos =  buildTooltip("#visu1");


    var visu = Pack(obj, {
      value: (d) => d.msPlayed,
      label: (d, n) => d.name,
      width: 650,
      height: 650,
      tooltip_infos : tooltip_infos
    });
    var element = document.getElementById("visu1");
    element.appendChild(visu);
  }