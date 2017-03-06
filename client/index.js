'use strict'

window.onload = function (){

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
    console.log(data)




    const scoreData = data.map((d) => {
      return ['final', 'maintenance', 'popularity', 'quality']
          .map((p, i) =>{
              return [i, d[p]]
            })
          })

    const usageData = data.map((d) => {
      return d.downloadsAcceleration.map((a) =>{
        const dateTo = new Date(a.to)
        const dateFrom = new Date(a.from)

        const timeSpan = dateTo - dateFrom
        return {'time': timeSpan, 'count': a.count}
      })
    })

console.log(usageData)

// const usageScale = d3.scaleLinear().
//   .domain([0, d3.max(usageData), function(d){
//     return d[1]
//   }])
//   .range(1, 100)

    //bar chart, appenfd data with a fillwd and scaled bar chart


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

      const barGraph = g.append('g')
        .attr('class', 'usageGraph')
        .selectAll('bar')
        .data(usageData)
        .enter()
        .append('rect')
        .attrs({
          transform: 'translate(' + [500, 10] + ')',
          width: 100,
          height: 100,
          x: (d, i) => {
            return i * 150
          },
          y: (d, i) => {
            return i * 0
          }
        });


      const createPaths = g.append('g')
        .attr('class', 'lineGraph')
        .selectAll('path')
        .data(scoreData) //array of array
        .enter()
        .append('path')
        .attr('transform', 'translate(' + [0, 0] + ')')
        //.attr('d', path(d.score.final))
        .attr('d', (d) => {
              return path(d)
        })

        const dateDifference = function(date1, date2){
          console.log(date1 - date2);
        }

        const verticalAxis = g.append('g')
          .attr('class', 'axis')
          .selectAll('axis')
          .data(scoreData[0])
          .enter()

          .each(function(d, i){
            d3.select(this)
              .append('g')
              .attr('transform', 'translate(' + [(100 * i), 0] + ')')
              .call(axis.scale(y))
          })

}
}
