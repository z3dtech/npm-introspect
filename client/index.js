'use strict'

window.onload = function (){

  const datum =[
  // key is equivalent to y coordinate and value is equivalent to x
    {final: [.8888, .46464, .66663, .96706, .84071299, .86868, .63636, .96969]},
    {popularity: [.6888, .66464, .66663, .66706, .64071299, .66868, .63636, .96669]},
    {maintenance: [.8888, .46464, .26663, .96706, .24071299, .86868, .93636, .96969]},
    {quality: [.3888, .36464, .36663, .36706, .34071299, .83868, .33636, .93969]}
  ]



  const margin = {top: 100, right: 10, bottom: 100, left: 10},
        width = window.innerHeight - margin.left - margin.right,
        height = window.innerWidth - margin.top - margin.bottom,
        line = d3.line(),
        axis = d3.axisLeft(),
        y = d3.scaleLinear()
          .domain([1, 0])
          .range([0, height]);

const url = '/datam.json'
d3.request(url)
  .mimeType('application/json')
  .response(function(xhr) { return JSON.parse(xhr.responseText); })
  .get(processData);

  function processData(err, rawData){
    if (err) console.log(err);

    const data = JSON.parse(rawData);



    const lineData = data.map((d) => {['final', 'detail[maintenance]', 'detail.popularity', 'detail.quality'].map((p, i) =>{
                    console.log(d.score[p])
                    return [i, d.score[p]];

                  })
                })

    console.log(lineData)

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


      const path = d3.line()
        .x(function(d, i) {
           return 100 * d[0]; })
        .y(function(d, i) {
           return y(d[1])
         })




      const createPaths = g.append('g')
        .attr('class', 'lineGraph')
        .selectAll('path')
        .data(data) //array of array
        .enter()
        .append('path')

        .attr('transform', 'translate(' + [0, 0] + ')')
        //.attr('d', path(d.score.final))
        .attr('d', (d) => {
             var g  = ['maintenance', 'popularity', 'quality'].map((s, i) =>{
                return [i, d.score.detail[s]]
              }
            )
              return path(g)
        })





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

}
}
