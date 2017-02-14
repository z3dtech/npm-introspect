window.onload = function (){

  const data =[
  //  {name: ['async', 'bluebird', 'webpack', 'request']},
    {final: [.84071299, .964345, .9622, .85729]},
    {maintenance: [.66663, .75394, .96475, .4392]},
    {popularity: [.96706, .85683, .89832, .8952]}
  ]

  const coors = [
    {x: 45, y: 120},
    {x: 60, y: 120},
    {x: 25, y: 23}
  ]
  const height = window.innerHeight,
        width = window.innerWidth
        line = d3.line(),
        axis = d3.axisLeft()
        x = d3.scaleOrdinal().range([0, width], 5)


  d3.json('/data.json', function(err, json) {
      if (err) console.log(err)

  var i = []
  json.forEach(function(d){
    i.push({
      name: d.name,
      quality: d.score.detail.quality,
      popularity: d.score.detail.popularity,
      maintenance: d.score.detail.maintenance,
      final: d.score.final
    })
  })

      const svg = d3.select("body").append("svg")
          .attrs({
              width: width,
              height: height
          });

      const g = svg.append('g')
          .attr('transform', 'translate(' + [10, 10] + ')' )


      const path = d3.line()
          .x(function(d) {
            console.log(x(d.final))
            return d.final * 20; })
          .y(function(d) {
            return d.maintenance * 20; });

      const paths = g.append('g')
        .attr('class', 'score')
        .selectAll('path')
        .data(i)
        .enter().append('path')
        .attr('d', path(i))

    // g.append(g)
    //   .attr('class', 'axis')
    //   .each(function(d){
    //     d3.select(this).call(axis.scale(x))
    //   })



      // var i = {}
      // json.forEach(function(d){
      //     i.name = d.name;
      //     i.quality =  d.score.detail.quality;
      //     i.popularity = d.score.detail.popularity;
      //     i.maintenance = d.score.detail.maintenance;
      //     i.final = d.score.final;
      //   })


        // console.log(i)
        // var i = []
        // json.forEach(function(d){
        //   i.push(d.score.detail.quality)
        // })






})
}
