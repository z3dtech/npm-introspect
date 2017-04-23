'use strict'
window.onload = function() {
    const margin = {
            top: 100,
            right: 10,
            bottom: 100,
            left: 10
        },
        width = window.innerHeight - margin.left - margin.right,
        height = window.innerWidth - margin.top - margin.bottom,
        line = d3.line(),
        axis = d3.axisLeft(),
        y = d3.scaleLinear()
        .domain([1, 0])
        .range([0, height]);

    // const url = '/datam.json'
    // d3.request(url).mimeType('application/json').response(function(xhr) {
    //     return JSON.parse(xhr.responseText);
    // }).get(processData);
    // function processData(err, rawData) {
    //     if (err)
    //         console.log(err);


    d3.json('data1.json', function(err, data) {
        if (err) {
            console.log(err)
        };
        console.log(data)

        const svg = d3.select('.lineChart') //change name from svg
            .attrs({
                width: width,
                height: height
            });

        const g = svg.append('g')
            .attr('transform', 'translate(' + [100, 10] + ')')



        const information = d3.select('.information').append('ul')
        const status = d3.select('.status').append('ul')
        //const warnings = d3.select('.')


        const table = d3.select('.table')
            .append('table')
            .attr('width', 30)
            .attr('height', '30')
            .append('tr')


        const formatText = function(module) {

          //add status

            // let dependencyTable = table.selectAll('td')
            // .data(module.dependencies)
            //
            // dependencyTable
            //     .enter()
            //     .append('td')
            //     .merge(dependencyTable)
            //     .text(function(d) {
            //         return d[1] //list of objects
            //     })

            let header = information.selectAll('li')
            .data(module.information)

            header
            .enter()
            .append('li')
            .attr('class', function(d){
              return d[0]
            })
            .merge(header)
            .text(function(d){
              return d[0] + ' : ' + d[1]
            })
            //let vulnerabilities= status.selectAll('li')
            //.data(module.vulnerabilities)

            //vulnerabilities
            //.enter()
            //.append('li')

            //.merge(vulnerabilities)
            //.text(function(d){
              //console.log(d)
              //return 'Vulnerability: ' + d;
            //})

            let outdatedDependencies = status.selectAll('li')
            .data(module.outdatedDependencies[0] || [])

            outdatedDependencies
            .remove()
            .enter()
            .append('li')
            .merge(outdatedDependencies)
            .text(
              function(d){
                console.log(d)
                return d;
              })
          }



        const handleMouseOver = function(d) {
            d3.select(this)
                .attr('d', (d) => {
                    console.log(d)
                })
            formatText(d)
            buildBubbleChart(d)
        }

        const handleMouseOut = function(d) {
            d3.select(this)
                .style('fill', 'lightBlue')
        }

        const path = d3.line()
            .x(function(d, i) {
                return 100 * d[2];
            })
            .y(function(d, i) {
                return y(d[1])
            })

        const createPaths = g.append('g')
            .attr('class', 'lineGraph')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('transform', 'translate(' + [0, 0] + ')')
            .attr('class', (d) => {
                return d.name
            })
            .attr('d', (d) => {
                return path(d.scores)
            })
            .on('mouseover', (d) => handleMouseOver(d))
            .on('mouseout', (d) => handleMouseOut(d));


        const verticalAxis = g.append('g')
            .attr('class', 'axis')
            .selectAll('axis')
            .data(data[0].scores)
            .enter()
            .each(function(d, i) {
                d3.select(this)
                    .append('g')
                    .attr('transform', 'translate(' + [
                        (100 * i), 0
                    ] + ')')
                    .call(axis.scale(y))
            })


        const widthScale = function(arr, d) {
            console.log('here' + d)
            console.log(arr)
            const wScale = d3.scaleLinear()
                .domain(d3.extent(arr))
                .range([0, 75]);
            console.log(wScale(d))
            return wScale(d)
        }

        const heightScale = function(arr, d) {
            const hScale = d3.scaleLinear()
                .domain(d3.extent(arr))
                .range([0, 200]);
            return hScale(d)
        }

       const bubbleChart = d3.select('.bubbleChart')
       .attrs({
         height: 400,
         width: 400
       })
       const buildBubbleChart = function(d){
        //build chromatic scale




         let dependencies = bubbleChart.selectAll('.node') //change to circles
         .data(d.dependencies)

         dependencies
         .remove()
         .enter()
         .append('circle')
         .attrs({
           r: Math.random() * 25,
           cx: Math.random() * 400,
           cy: Math.random() * 400,
         })
         .merge(dependencies)




        //  let header = information.selectAll('li')
        //  .data(module.information)
         //
        //  header
        //  .enter()
        //  .append('li')
        //  .merge(header)
        //  .text(function(d){
        //    return d[0] + ' : ' + d[1]
        //  })


       }




    })

}
