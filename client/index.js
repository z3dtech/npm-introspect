j'use strict'

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


      const timeDiffernce = function(dateTo, dateFrom){
          let diff = dateTo - dateFrom;
          const days = Math.floor(diff / 1000 / 60 / 60 /24);
          diff -= days * 1000 * 60 * 60 * 24;

          return days
      }

    const scoreData = data.map((d) => {
      let data = {'name': d.name, 'score' : []};
       ['final', 'maintenance', 'popularity', 'quality']
          .map((p, i) =>{
              data.score.push([i, d[p]])
            })
        return data
          })


          /////here we need 14 arrays of three objects of six item array

    const usageData = data.map((d) => {
      let data = { 'name': d.name, 'rate': [], 'time': [], 'coordinates': []}

    let usageData = {}
    const downloads = data.forEach((d) => {
      d.downloadsAcceleration.forEach((a, i) =>{
        usageData[d.name] = { 'time': [], 'count': [], 'rate':[]}
        const dateTo = i === 0? new Date(a.to) : new Date(d.downloadsAcceleration[(i-1)].from)
        const count  = i!== 0? a.count - d.downloadsAcceleration[(i-1)].count : a.count;
        const dateFrom = new Date(a.from);
        const timeSpan = timeDiffernce(dateTo, dateFrom)

        data.coordinates.push({'time' : timeSpan, 'count': count, 'rate' : Math.floor(count/timeSpan)})
        data.time.push(timeSpan)
        data.rate.push(Math.floor(count/timeSpan))
      })
    })

    console.log(usageData)

      // const usageScale = function(value){
      //   return d3.scaleLinear()
      //   .domain(d3.extent(value))
      //   .range(1, 200)
      // }


    const widthScale = function(arr, d){
      console.log('here' + d)
      console.log(arr)
      const wScale = d3.scaleLinear()
      .domain(d3.extent(arr))
      .range([0, 75]);

      console.log(wScale(d))
      return wScale(d)
    }

    const heightScale = function(arr, d){

      const hScale = d3.scaleLinear()
      .domain(d3.extent(arr))
      .range([0, 200]);
      return hScale(d)
    }

    //bar chart, appenfd data with a fillwd and scaled bar chart


            //create the average downloads per week for x weeeks
            //divide

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


         //build out the axis and the scale and then call an initial value
         //to build the graph reandomly from the list, on mouseover then re build
         //the width and length with new data
         //set default to function execution
         // I have to retrieve

        const nameToIndex = function(pkgName){
          let result;
          usageData.forEach((pkg, i) => {
            if(pkg.name === pkgName) result = i
          })
          return result;
        }


      const barGraph = function(name= usageData[0]){

        console.log(usageData)

        const idx = nameToIndex(name)



        g.append('g')
        .attr('class', 'usageGraph')
        .selectAll('bar')
        .data(usageData[idx].coordinates)
        .enter()
        .append('rect')
        .attrs({
          transform: 'translate(' + [300, 10] + ')',

          width: (d, i) => {
            console.log(d)
            console.log(widthScale(usageData[idx]['time'], d.time))
            return widthScale(usageData[idx]['time'], d.time)
          },
          height: (d, i) => {

            return heightScale(usageData[idx]['rate'], d.rate)
          },
          x: (d, i) => {
            return 100 * i //widthScale(d.time)
          },
          y: (d, i) => {
            return 100 * i //heightScale(d.rate)
          }
        });
      }


      const displayData = function(pkgName){
        console.log(pkgName)
        barGraph(pkgName)

      }


      const createPaths = g.append('g')
        .attr('class', 'lineGraph')
        .selectAll('path')
        .data(scoreData) //array of array
        .enter()
        .append('path')
        .on('click', (d) => {
          //toggle class visible, invisible
          displayData(d.name)
        })
        .attr('transform', 'translate(' + [0, 0] + ')')
        .attr('class', (d) => {
          return d.name
        })
        .attr('d', (d) => {
              return path(d.score)
        })



        const verticalAxis = g.append('g')
          .attr('class', 'axis')
          .selectAll('axis')
          .data(scoreData[0].score)
          .enter()

          .each(function(d, i){
            d3.select(this)
              .append('g')
              .attr('transform', 'translate(' + [(100 * i), 0] + ')')
              .call(axis.scale(y))
          })

}
}



/*
In the end, we went with standing up Node processes behind an Nginx proxy
layer and architected the interface in such a way that each network request
would be a stateless render. This allowed us to farm requests out to the
process group and scale the number of processes as needed.

look at better ways to deal with serializing and deserailizing data quickly


Avoid unnecessary data serialization. There were several hotspots in our
\template rendering where we were simply embedding large amounts of data
in the markup in order to send to the browser. These were located mainly in
the static head and around the body end tags, and were consistent for every
web request. A big slowdown was the serialization and deserialization of these
 huge JSON blobs of data to our workers. Avoiding this helped us gain another performance edge that finally got us to parity.


*/
