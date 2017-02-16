window.onload = function (){

  //lets check request data and see what we should get rid of
  //then transform the data and finish the visuals

  // const data =[
  // //  {name: ['async', 'bluebird', 'webpack', 'request']},
  //   {final: [.84071299, .964345, .9622, .85729]},
  //   {maintenance: [.66663, .75394, .96475, .4392]},
  //   {popularity: [.96706, .85683, .89832, .8952]}
  // ]

  const coors = [
    {x: 45, y: 120},
    {x: 60, y: 120},
    {x: 25, y: 23}
  ]

  const margin = {top: 100, right: 10, bottom: 100, left: 10},
        width = window.innerHeight - margin.left - margin.right,
        height = window.innerWidth - margin.top - margin.bottom,
        line = d3.line(),
        axis = d3.axisLeft(),
        y = d3.scaleLinear()
          .domain([1, 0])
          .range([0, height]);

var datum

url = '/datam.json'
d3.request(url)
  .mimeType('application/json')
  .response(function(xhr) { return JSON.parse(xhr.responseText); })
  .get(processData)
 //check on error in d3 system

  function processData(data, err){
    if (err) console.log(err)

    console.log(data)



  // d3.json('/data.json', function(err, json) {


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
        // g.append("g")
        //       .attr("class", "axisOrdinal")
        //       .each(function(d) { d3.select(this).call(axis.scale(x.domain(d3.extent(i, function(d){ return d.name})))); })


        const verticalAxis = g.append('g')
          .attr('class', 'axis')
          .selectAll('axis')
          .data(i)
          .enter()

          .each(function(d, i){
            d3.select(this)
              .append('g')
              .attr('transform', 'translate(' + [(100 * i), 0] + ')')
              .call(axis.scale(y))
          })

      // var i = {}
      // json.forEach(function(d){
      //     i.name = d.name;
      //     i.quality =  d.score.detail.quality;
      //     i.popularity = d.score.detail.popularity;
      //     i.maintenance = d.score.detail.maintenance;
      //     i.final = d.score.final;
      //   })

}
}
