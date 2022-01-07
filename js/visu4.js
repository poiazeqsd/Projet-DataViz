function setup_visu4(json, artistes_json, artistes) {


    const color = d3
      .scaleSequential()
      .domain([0, artistes.length - 1])
      .interpolator(d3.interpolateSinebow);
    var boo = true;
      artistes_json.forEach( j => {
          //if(boo)
          //console.log(j);
          boo = false;
    })
    /*var element = document.getElementById("visu4");
    element.appendChild(visu);*/
  }