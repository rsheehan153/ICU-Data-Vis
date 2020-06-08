   var graph;
    var dataset;
    
    d3.csv('public/data/ICU.csv', function(data) {
    dataset = data;

      graph = d3.parcoords()('#wrapper')
                .data(data)
                .alpha(0.4)
                .mode("queue")
                .rate(5)
                .render()
                .interactive()
                .reorderable()
                .brushable();

      graph.svg
           .selectAll(".dimension")
           .on("click", change_color)
           .on("dblclick", flipAxisAndUpdatePCP)

      var grid = d3.divgrid();
      d3.select("#grid")
          .datum(data.slice(0,10))
          .call(grid)
          .selectAll(".row")
          
          .on({
            "mouseover": function(d) { graph.highlight([d]) },
            "mouseout": graph.unhighlight
          });
            
      graph.on("brush", function(d) {
        d3.select("#grid")
          .datum(d.slice(0,10))
          .call(grid)
          .selectAll(".row")
          .on({
            "mouseover": function(d) { graph.highlight([d])},
            "mouseout": graph.unhighlight
          });
      });
  });

    var color_scale = d3.scale.linear()
                        .domain([-2,-0.5,0.5,2])
                        .range(["#DE5E60", "steelblue", "steelblue", "#98df8a"])
                        .interpolate(d3.interpolateLab);

    function change_color(dimension) {
      graph.svg.selectAll(".dimension")
        .style("font-weight", "normal")
        .filter(function(d) { return d == dimension; })
        .style("font-weight", "bold")

      graph.color(zcolor(graph.data(),dimension)).render()
    }

    function zcolor(col, dimension) {
      var z = zscore(_(col).pluck(dimension).map(parseFloat));
      return function(d) { return color_scale(z(d[dimension]))}
    };

    function zscore(col) {
      var n = col.length,
      mean = _(col).mean(),
      sigma = _(col).stdDeviation();

      return function(d) {
        return (d-mean)/sigma;
      };
    };
    
    function callUpdate(data) {
             graph.data(data).brush().render().updateAxes();
             
    }

    function flipAxisAndUpdatePCP(dimension, i) {
      var grid = d3.divgrid();
      var g = grid.svg.selectAll(".dimension");
    
      grid.flip(dimension);
      d3.select(g[0][i])
        .transition()
          .duration(1100)
          .call(axis.scale(yscale[dimension]));
    
      grid.render();
      if (flags.shadows) paths(__.data, ctx.shadows);
    }