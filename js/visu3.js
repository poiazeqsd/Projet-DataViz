function setup_visu3(js, arts, top_artistes = undefined) {
  var json = js;
  var artistes = arts;// Listes des artistes à afficher
  if (top_artistes !== undefined) {
    artistes = artistesByTime(json, top = top_artistes);// On récupère le top des artistes les + écoutés
    const liste_art = new Set(artistes);
    json = json.filter(d => liste_art.has(d.artistName));
  }


  var margin = { top: 10, right: 30, bottom: 40, left: 70 },
    width = 1500 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

  const svg = d3
    .select("#visu3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  var dates = [];
  var tab_ms_by_day = {};
  for (var i in json) {
    var tt = new Date(json[i].endTime);
    var tt2 = new Date(tt.getFullYear(), tt.getMonth(), tt.getDate());
    json[i].endTime = tt2;
    dates.push(tt2);

    if (json[i].endTime in tab_ms_by_day) {
      tab_ms_by_day[json[i].endTime] += json[i].msPlayed ;
    } else {
      tab_ms_by_day[json[i].endTime] = json[i].msPlayed ;
    }
  }

  for( var a  in tab_ms_by_day){
    tab_ms_by_day[a] = Math.round(tab_ms_by_day[a] / 1000);
  }

  dates = dates.filter(
    (date, i, self) =>
      self.findIndex((d) => d.getTime() == date.getTime()) === i
  );

  var map1 = new Map();

  var data = [];

  dates.forEach((d) => {
    var data_date = json.filter((j) => {
      return j.endTime.getTime() == d.getTime();
    });
    var dico = {};
    dico["date"] = d;

    var tab = [];
    artistes.forEach((a) => {
      var art_obt = data_date.filter((jse) => {
        return jse.artistName === a;
      });
      if (art_obt.length != 0) {
        var somme = 0;
        art_obt.forEach((s) => {
          somme += s.msPlayed;
        });
        tab.push(Math.round(somme / 1000));
      } else {
        tab.push(0);
      }
    });

    for (var i in artistes) {
      dico[artistes[i]] = tab[i];
    }
    data.push(dico);
    map1.set(d, tab);
  });

  var min_date = d3.min(dates, function (d) {
    return d;
  });

  var max_date = d3.max(dates, function (d) {
    return d;
  });

  var max_ms = d3.max(Object.values(tab_ms_by_day), function (d) {
    return d;
  });

  const x = d3.scaleUtc().domain([min_date, max_date]).range([0, width]);

  const x_axis = d3
    .axisBottom(x)
    .tickValues(dates)
    .tickFormat(d3.timeFormat("%d-%m"));

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(x_axis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-30)";
    });

  const y = d3.scaleLinear().domain([0, max_ms]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  const color = d3
    .scaleSequential()
    .domain([0, artistes.length - 1])
    .interpolator(d3.interpolateSinebow);

  var stackedData = d3.stack().keys(artistes)(data);

  const jour_en_ms = 86400000;

  const nb_jours = Math.round(
    (max_date.getTime() - min_date.getTime()) / jour_en_ms
  );

  const bandwidth = width / nb_jours;

  const tooltip_infos = buildTooltip("#visu3");


  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", (d) => color(artistes.indexOf(d.key)))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => x(d.data.date))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", bandwidth)
    .on("mouseover", tooltip_infos.mouseover)
    .on("mousemove", tooltip_infos.mousemove)
    .on("mouseleave", tooltip_infos.mouseleave);
}