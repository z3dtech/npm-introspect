/*
add a line to show the mean of the scores
add a way to dynamically add modules and add from command line
deal with when a borked package is requested
make sure it is obvious what the scores mean and what we are looking at
maybe we search for packages or we can add in a form document
popularity needs to have a computed scale - maybe get neighboring information
  or averages from other packages

red flag bad packages
allow ability to search



*/
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

        y = d3.scaleLinear()
          .domain([1, 0])
          .range([0, height]),
        popY= d3.scaleLinear()
          .range([0, height]),
        x0 = d3.scaleBand()  //group spacing
          .rangeRound([0, width])
          .paddingInner(0.1),
        x1 = d3.scaleBand()  //this will compute the x values
          .padding(0.05),
        color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]); //add colors

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

        const pkgs = (function(){
          let names = []
          for(let pkg in data){
          names.push(data[pkg].title[1])
          }
          return names
        })()

        x0.domain(pkgs)
        x1.domain(['quality', 'popularity', 'maintenance', 'final']).rangeRound([0, x0.bandwidth()]); //4 number of score types


        const subScores = d3.select('.subScores')
        // const dependencies = d3.select('.dependencies').append('g')


        const scoreScale = (function(){
          let scale = [[], [], [], []];
          for (let pkg in data){
            //console.log(data[pkg].scores[1][1])
            data[pkg].scores.forEach((cat, i) => {
              scale[i].push(data[pkg].scores[i][1])
              })
            }
            return scale
          })()
        console.log(scoreScale)

        const popularScale = (function(){    //turn into an object with three p
          let pScale = {'communityInterest':[], 'downloadsCount':[], 'downloadsAcceleration':[], 'dependentsCount':[]}
          for (let pkg in data){
            for(let i = 0; i < data[pkg].subScores[1].length; i++){
              pScale[data[pkg].subScores[1][i][0]].push(data[pkg].subScores[1][i][1])
            }
          }
          return pScale
        })()

        console.log(popularScale)



        const scores = d3.select('.scores')
          .attr('width', width)
          .attr('height', height)

        const handleMouseOver = function(e, that) {
          // d3.select(that).classed('foreground', true)
          // change the hue of the column being hovered over
        }
        const handleMouseOut = function(e, that){
          // turn off highlight
        }

        const handleClick = function(e, that){
          // popY.domain([d3.extent()]) //move
          buildSubScores(e)
        }

        //okay lets
        const buildSubScores = function(pkg, scale){
          subScores.append('g')
          .selectAll('g')
          .data(pkg.subScores)
          .enter()
          .append('g')
          .attr('transform', (d) => {
            console.log(d)
            return 'translate(' + [10, 10] + ')';
          })
          .selectAll('rect')
          .data(function(d){
            console.log(d)
            return d
          }).enter().append('rect')
          .attrs({
            x: (d, i) => {return x1(d[0])},
            y: (d, i) => {
              if(d[0] === 'communityInterest' || d[0] === 'downloadsCount'|| d[0] === 'downloadsAcceleration' || d[0] === 'dependentsCount'){
                const tScale = popY.domain(d3.extent(popularScale[d[0]]))
                return tScale(d[1])
              }
              return y(d[1])},
            width: (d) => {return x1.bandwidth()},
            height: (d) => {
              if(d[0] === 'communityInterest' || d[0] === 'downloadsCount'|| d[0] === 'downloadsAcceleration' || d[0] === 'dependentsCount'){
                const tScale = popY.domain(d3.extent(popularScale[d[0]]))
                return tScale(d[1])
              }
              return height - y(d[1])},
            fill: (d) => {return color(d[0])}
          })
        }



        const buildScoresChart = scores.append('g')
          .selectAll('g')
          .data(data)
          .enter()
          .append('g')
          .on('click', function(e){
            // send data for the entire group, not the individual bar
            buildSubScores(e)})
          .on('mouseover', function(e){
            handleMouseOver(e, this)})
          .on('mouseover', function(e){
            handleMouseOut(e, this)})
          .attr('transform', (d) => {
            //console.log(d)
            return 'translate(' + x0(d.title[1]) + ',0)';
          })
          .selectAll('rect')
          .data(function(d) { //pass a loop of data
            //console.log(d)
            return d.scores})
          .enter().append('rect')
            .attrs({
              x: (d, i) => {return x1(d[0])},
              y: (d, i) => {return y(d[1])},
              width: (d) => {return x1.bandwidth()},
              height: (d) => {return height - y(d[1])},
              fill: (d) => {return color(d[0])}
            })















/*

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
                const tempScale= scale(pathscoreScale[i])
                return tempScale(d[1])
                //console.log(pathscoreScale[i])
                // console.log()
                // return y(d[1])
            })


        // const createPaths = g.append('g')
        //     .selectAll('path')
        //     .data(data)
        //     .enter()
        //     .append('path')
        //     .attr('class', 'background')
        //     .attr('d', (d) => {
        //       console.log('inside createpaths ' + d)
        //         return path(d.scores)
        //     })
        //     .on('mouseover', function(e){
        //       handleMouseOver(e, this)})
        //     .on('mouseout', function(e){
        //       handleMouseOut(e, this)})
        //
        // const createNodes = g.selectAll('path-to-circle')
        //   .data(data)
        //   .enter()
        //   .append('g')
        //   .attr('foo', function(d){
        //     //console.log(d)
        //   })
        //   .selectAll('circle')
        //   .data(function(d){
        //     return d.scores
        //   })
        //   .enter()
        //   .append('circle')
        //   .attr('gg', function(d){
        //   } )
        //   .attr('cx', function(d){return d[2]})
        //   .attr('cy', function(d){return d[1]}) //pass through sclaing function
        //   .attr('r', '25px')
        //





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





        // const verticalAxis = g.append('g')
        //     .attr('class', 'axis')
        //     .selectAll('axis')
        //     .data(data[0].scores)
        //     .enter()
        //     .each(function(d, i) {
        //         d3.select(this)
        //             .append('g')
        //             .attr('transform', 'translate(' + [
        //                 (100 * i), 0
        //             ] + ')')
        //             .call(axis.scale(y)) //change scale
        //     })


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

*/
    })

}
