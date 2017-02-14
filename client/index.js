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
        // line = d3.line(),
        // axis = d3.axisLeft()
        // x = d3.scaleOrdinal().range([0, width], 1)


  // d3.json('/data.json', function(err, json) {
  //     if (err) console.log(err)

 // function (range, value ){
 //   const gluf =  d3.scaleLinear(value){
 //           .domain([0, 1])SS
 //           .range([range[0], range[1]])
 //         }value
 //         return gluf()
 // }
      const svg = d3.select("body").append("svg")
          .attrs({
              width: width,
              height: height
          });


      path = d3.line()
          .x(function(d) {
            return d.x; })
          .y(function(d) {
            return d.y; });

      svg.append('g')
      .attr('class', 'score')
      .selectAll('path')
      .data(coors)
      .enter().append('path')
      .attr('d', path(coors))
        //path should return ordinal x value for axis
        //the y value should be the simple range




      // var i = {}
      // json.forEach(function(d){
      //     i.name = d.name;
      //     i.quality =  d.score.detail.quality;
      //     i.popularity = d.score.detail.popularity;
      //     i.maintenance = d.score.detail.maintenance;
      //     i.final = d.score.final;
      //   })

        // var i = []
        // json.forEach(function(d){
        //   i.push({
        //     name: d.name,
        //     quality: d.score.detail.quality,
        //     popularity: d.score.detail.popularity,
        //     maintenance: d.score.detail.maintenance,
        //     final: d.score.final
        //   })
        // })
        // console.log(i)
        // var i = []
        // json.forEach(function(d){
        //   i.push(d.score.detail.quality)
        // })






//})
}
