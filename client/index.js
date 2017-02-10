window.onload = function (){

  const line = d3.line(),
    axis = d3.axisLeft()

  d3.json('/data.json', function(err, json) {
      if (err) console.log(err)


      const height = window.innerHeight;
      const width = window.innerWidth;


      const svg = d3.select("body").append("svg")
          .attrs({
              width: width,
              height: height
          });

      const g = svg.selectAll('.nodes')
        .data(json)
        .enter().append('g')


      const nodes = g.append('circle')
          .attrs({
            cy: (height/2),
            cx: function(d){
              //return scoreScale(d.score.detail.popularity)
              console.log(d.score.detail.popularity)
              return (d.score.detail.popularity * width)
            },
            r: function(d){
              return scoreScale()
            }
          })

      // g.append('g')
      //   .attr('class', 'axis')
      //   .each(function(d) { //axis })

    var scoreScale = d3.scaleLinear()
      .domain([0, function(d){
        return d.score.final
      }])
      .range([0, 30]);



  })

  // .on('click', console.log(function(d){
  //    return d.score.final
  //  }))


}
/*
// Add an axis and title.
g.append("g")
  .attr("class", "axis")
  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
.append("text")
  .style("text-anchor", "middle")
  .attr("y", -9)
  .text(function(d) { return d; });

  // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
      return d != "name" && (y[d] = d3.scale.linear()
          .domain(d3.extent(cars, function(p) { return +p[d]; }))
          .range([height, 0]));
    }));

});
*/
