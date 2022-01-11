

Promise.all([d3.json("data/StreamingHistory0.json"), d3.json("data/artists.json")])
    .then(function (files) {
        var json = files[0];
        var artistes_json = files[1];
        var artistes = getArtistes(json, false);
        var genres = getGenres(artistes_json, false);

        setup_visu1(json, artistes);
        setup_visu2(json, artistes);
        setup_visu3(json, artistes);
        setup_visu4(json, artistes_json, artistes , genres);
    })
    .catch(function (err) {
    });