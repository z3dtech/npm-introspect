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
        axis = d3.axisLeft(),
        x = d3.scaleBand().range([0, width])
        //.domain(['async', 'bluebird', 'webpack', 'request'])
        // .round([0.1])
        .paddingInner([0.1])
  	    .paddingOuter([0.3])
  	    .align([0.5])
        y = d3.scaleLinear()
          .domain([0, 1])
          .range([0, height])

//var axis = d3.axisLeft()



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

  console.log(i)
      const svg = d3.select("body").append("svg")
          .attrs({
              width: width,
              height: height
          });

      //console.log( x.domain(['async', 'bluebird', 'webpack', 'request']))

      const g = svg.append('g')
          .attr('transform', 'translate(' + [100, 10] + ')' )


      const path = d3.line()
          .x(function(d) {
            return d.final * 200; })
          .y(function(d) {
            return y(d.maintenance); });

      const paths = g.append('g')
        .attr('class', 'score')
        .selectAll('path')
        .data(i)
        .enter().append('path')
        .attr('transform', 'translate(' + [0, 0] + ')')
        .attr('d', path(i))
 /////////////start here
        g.append("g")
              .attr("class", "axisOrdinal")
              .each(function(d) { d3.select(this).call(axis.scale(x.domain(d3.extent(i, function(d){ return d.name})))); })



        const verticalAxis = g.append('g')
          .attr('class', 'axis')
          .selectAll('axis')
          .data(i)
          .enter()
          //.call(d3.axisLeft(y))
          .each(function(d, i){
            console.log(this)
            console.log(i)
            d3.select(this)
              .append('g')
              .attr('transform', 'translate(' + [(20 * i), 30] + ')')
              //.call(d3.axisLeft(y))
              .call(d3.axisLeft(y))
            console.log('yo')
          })



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
