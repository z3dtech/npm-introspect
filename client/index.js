'use strict'
window.onload = function() {
    const margin = {
            top: 100,
            right: 10,
            bottom: 100,
            left: 10
        },
        width = window.innerHeight,
        height = window.innerWidth,
        line = d3.line(),
        axis = d3.axisLeft(),
        y= d3.scaleLinear()
          .domain([1, 0])
          .range([0, height]);


//////
//tooltip and generate subscores properly in bar chart
//check if bar chart makes the most sense
//then dependency chart
/////


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
            // .attr('transform', 'translate(' + [100, 10] + ')')

        const title = d3.select('.title').append('ul').attr('class', 'header');
        const github = d3.select('.github').append('ul');
        const outdated = d3.select('.outdated').append('th').text('Outdated Dependencies')
        const vulnerable = d3.select('.vulnerable');


        const pathScales = (function(){
          let scale = [[], [], [], []];
          for (let pkg in data){
            console.log(data[pkg].scores[1][1])
            data[pkg].scores.forEach((cat, i) => {
              scale[i].push(data[pkg].scores[i][1])
              })
            }
            return scale
          })()

          const scale = function(coordinates){
            const domain = d3.extent(coordinates)
            return d3.scaleLinear()
              .domain([domain[1], domain[0]])
              .range([0, height]);
          }





        const formatText = function(pkg) {

            let header = title.selectAll('li')
            .data(pkg.title)

            header
            .enter()
            .append('li') //add class
            .attr('class', function(d){
              return d[0]
            })
            .merge(header)
            .text(function(d){
              return  d[1]
            })


            let gitStats = github.selectAll('li')
            .data(pkg.github)

            gitStats
            .enter()
            .append('li')
            .attr('class', function(d){
              return d[0]
            })
            .merge(gitStats)
            .text(function(d){
              return d[1]
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

            let outdatedDependencies = outdated.selectAll('td')
            .data(pkg.outdatedDependencies[0] || [])

            outdatedDependencies
            .enter()
            .append('td')
            .merge(outdatedDependencies)
            .text(
              function(d){
                return d;
              })

            outdatedDependencies.exit().remove()
          }

          const bubbleChart = d3.select('.bubbleChart')
            .attrs({
                width: width,
                height: height
            });

          const buildBubbleChart = function(d){
           //build chromatic scale
            let dependencies = bubbleChart.selectAll('.node') //change to circles
            .data(d.dependencies);

            dependencies
            .enter()
            .append('circle')
            .merge(dependencies)
            .attrs({
              r: Math.random() * 25,
              cx: Math.random() * 400,
              cy: Math.random() * 400,
            });

            dependencies.exit().remove()
          }


        const handleMouseOver = function(e, that) {
          d3.select(that).classed('foreground', true)
          d3.select(that).classed('background', false)
            d3.select(this)
                .attr('d', (e) => {
                    console.log(e)
                })
            formatText(e)
            buildBubbleChart(e)
        }

        const handleMouseOut = function(d, that) {
          d3.select(that).classed('foreground', true)
          d3.select(that).classed('background', false)
        }

        const path = d3.line()
            .x(function(d, i) {
                return 100 * d[2];
            })
            .y(function(d, i) {
                const tempScale= scale(pathScales[i])
                return tempScale(d[1])
                //console.log(pathScales[i])
                // console.log()
                // return y(d[1])
            })


        const createPaths = g.append('g')
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'background')
            .attr('d', (d) => {
              console.log('inside createpaths ' + d)
                return path(d.scores)
            })
            .on('mouseover', function(e){
              handleMouseOver(e, this)})
            .on('mouseout', function(e){
              handleMouseOut(e, this)})

        const createNodes = g.selectAll('path-to-circle')
          .data(data)
          .enter()
          .append('g')
          .attr('foo', function(d){
            //console.log(d)
          })
          .selectAll('circle')
          .data(function(d){
            return d.scores
          })
          .enter()
          .append('circle')
          .attr('gg', function(d){
          } )
          .attr('cx', function(d){return d[2]})
          .attr('cy', function(d){return d[1]}) //pass through sclaing function
          .attr('r', '25px')






          // .each(function(d){
          //     d3.select(this).append('circle')
          //     .attr('d', function(d){
          //       console.log(d)
          //     })
              // .each(function(d))
              // d.scores.each((p ,i) => (console.log(p[2] + '  :  ' +  i)))
            //})

          // .append('circle')
          // // .attr('d', function(d){})
          //





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
                    .call(axis.scale(y)) //change scale 
            })


        // const widthScale = function(arr, d) {
        //     console.log('here' + d)
        //     console.log(arr)
        //     const wScale = d3.scaleLinear()
        //         .domain(d3.extent(arr))
        //         .range([0, 75]);
        //     console.log(wScale(d))
        //     return wScale(d)
        // }
        //
        // const heightScale = function(arr, d) {
        //     const hScale = d3.scaleLinear()
        //         .domain(d3.extent(arr))
        //         .range([0, 200]);
        //     return hScale(d)
        // }


    })

}
