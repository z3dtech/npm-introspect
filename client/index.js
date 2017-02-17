window.onload = function (){

  //lets check request data and see what we should get rid of
  //then transform the data and finish the visuals
  //when transform use two different objects to store
  //one for the score and one for the

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

url = '/datam.json'
d3.request(url)
  .mimeType('application/json')
  .response(function(xhr) { return JSON.parse(xhr.responseText); })
  .get(processData)

  function processData(err, rawData){
    if (err) console.log(err)

    const data = JSON.parse(rawData)
    console.log(data)

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


      // const transposeData = function(data){
      //   data.forEach(function(d) {
      //     console.log(d)
      //     console.log('----------------------------')
      //     primary.push({
      //       name: d.name,
      //       quality: d.score.detail.quality,
      //       popularity: d.score.detail.popularity,
      //       maintenance: d.score.detail.maintenance,
      //       final: d.score.final
      //     })
      //   })
      // }

      // transposeData(data)

      const svg = d3.select("body").append("svg")
          .attrs({
              width: width,
              height: height
          });

      const g = svg.append('g')
          .attr('transform', 'translate(' + [100, 10] + ')' )


      const createPaths(d){
        const keys = [d.score.detail.maintenance, d.score.detail.popularity, d.score.detail.quality, d.score.final]
        //the part where this is called four times
        return d3.line()
          .x(function(d, i) {
            return 100 * i; })
          .y(function(d, i) {
            return y(keys[i])
          });
        }

      const paths = g.append('g')
        .attr('class', 'score')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('transform', 'translate(' + [0, 0] + ')')
        .attr('d', createPaths(data));   //path(data));



        // .attrs({
        //   'transform': 'translate(' + [0,0] + ')',
        //   fill: none,
        //   stroke: steelblue,
        //   'stroke-width': '3px',
        // })
 /////////////start here
        // g.append("g")
        //       .attr("class", "axisOrdinal")
        //       .each(function(d) { d3.select(this).call(axis.scale(x.domain(d3.extent(i, function(d){ return d.name})))); })


        const verticalAxis = g.append('g')
          .attr('class', 'axis')
          .selectAll('axis')
          .data(data)
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
