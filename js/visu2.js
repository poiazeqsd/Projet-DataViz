function setup_visu2(json, artistes) {

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
            "col" : color(artistes.indexOf(json[i].artistName))
          });
        } else {
          tr.msPlayed += json[i].msPlayed;
        }
      } else {
        tab[json[i].artistName] = [
          { track: json[i].trackName, msPlayed: json[i].msPlayed, "col" : color(artistes.indexOf(json[i].artistName)) }
        ];
      }
    }
    var tab2 = [];
    for (var i in tab) {
      tab2.push({ name: i, children: tab[i] , "col" : color(artistes.indexOf(i))});
    }
    var obj = { name: "visu", children: tab2 };
    const tooltip_infos =  buildTooltip("#visu2");

    const tooltip = tooltip_infos.tooltip;
    var visu = Pack(obj, {
      value: (d) => d.msPlayed,
      label: (d, n) => {
        return d.track;
      },
      width: 1200,
      height: 1200,
      tooltip_infos : tooltip_infos
    });
    var element = document.getElementById("visu2");
    element.appendChild(visu);
  }