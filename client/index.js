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

link back to npms.io
use viewport to change dynamiclly the window
.attr('viewBox', '0 0 ' + size + ' ' + size);

use a table for the subscores and show a nice patagraph that represents the
infor on the module.
stop messing with sub scores and focus on a few pieces of important information rather
than everythign
compute a full set of graphs for popularity and just highlight the one in questions


Anticipate vulnerabilities in the packages you rely on- have an opening div that is replaced
once someone clicks
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
        sX0 = d3.scaleBand()  //group spacing
          .rangeRound([0, width])
          .paddingInner(0.1),
        axisScale = d3.scaleBand()  //group spacing
          .rangeRound([0, width])
          .paddingInner(0.1),
        ssX0 = d3.scaleBand()  //spacing for subscore groups
          .rangeRound([0, width])
          .paddingInner(0.1),
        sX1 = d3.scaleBand()  //this will compute the x values
          .padding(0.05),
        ssX1 = d3.scaleBand()  //this will compute the x values
          .padding(0.05),
        color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]); //add colors

    // const url = '/datam.json'
    // d3.request(url).mimeType('application/json').response(function(xhr) {
    //     return JSON.parse(xhr.responseText);
    // }).get(processData);
    // function processData(err, rawData) {
    //     if (err)
    //         console.log(err);


    d3.json('../data1.json', function(err, data) {
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

        const pkgNames = (function(){
          let names = []
          for(let pkg in data){
          names.push(data[pkg].title[0][1])
          }
          return names
        })()

        console.log(pkgs)

        const subScoreHeading = ['quality', 'popularity', 'maintenance'];
        const scoreHeading = ['quality', 'popularity', 'maintenance', 'final']

        sX0.domain(pkgs)
        sX1.domain(scoreHeading).rangeRound([0, sX0.bandwidth()]);

        ssX0.domain(subScoreHeading) //maybe this has to map to the groups better
        ssX1.domain(['carefulness', 'tests', 'health', 'branding', 'communityInterest', 'downloadsCount', 'downloadsAcceleration', 'dependentsCount', 'releasesFrequency', 'commitsFrequency', 'openIssues', 'issuesDistribution']).rangeRound([0, ssX0.bandwidth()]); //subScore names


        const star = '\u2605';   //U+2606 for other star





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
          buildInformation(e)
          buildDependencies(e)
        }









        const dependencies = d3.select('.dependencies')
        .attr('width', width)
        .attr('height', height)

        const buildDependencies = function(pkg){


          const treemap = d3.tree()
          .size([height, width]);

          d3.selectAll('g.node').remove() //this is a hack because the root will not remove properly

          const stratify = d3.stratify()
            .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
          let nodes = d3.hierarchy(pkg.dependencies, function(d) {
          return d.children;
          });
          nodes = treemap(nodes);




          const updateLinks = dependencies.selectAll(".link")
          .data(nodes.descendants().slice(1))

          const enterLinks = updateLinks.enter().append("path")
            .attr("class", "link")

          const exitLink = updateLinks.exit().remove();

           updateLinks.merge(enterLinks).attr("d", function(d) {
                      return "M" + d.y + "," + d.x
                        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                        + " " + d.parent.y + "," + d.parent.x;
                      });



          const updateNodes = dependencies.selectAll("g.node")
          .data(nodes.descendants(), d => d)


          const enterNodes = updateNodes.enter().append("g")
          .attr("class", function(d) {
                return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
          .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")"; })


          enterNodes.append("circle")
          .attr("r", function(d) { return 15; });

          enterNodes.append("text")
          .attr("dy", ".35em")
          .attr("x", function(d) {
          return 25 })
          .style("text-anchor", function(d) {
          return d.children ? "end" : "start"; })
          .text(function(d) { return d.data.name; });

          updateNodes.merge(enterNodes)

          const exitNode = updateNodes.exit().remove();








}
          // function project(x, y) {
          //   var angle = (x - 90) / 180 * Math.PI, radius = y;
          //   return [radius * Math.cos(angle), radius * Math.sin(angle)];
          // }




          ////////////////////////////
          /////////////////////////////////////////////////////
        //   const update = dependencies.selectAll('g.circles')
        //   .data(pkg.dependencies, d => d)
        //
        //   const enter = update.enter().append('g')
        //   .attr('transform', (d) => {
        //     return 'translate(' + ~~(Math.random() * 300) + ',' + ~~(Math.random() * 300) + ')'
        //   })
        //   .attr('class', 'circles');
        //
        //   enter.append('circle')
        //   .attr('fill', function(d){
        //     return '#43985E'
        //   });
        //
        //   enter.append('text')
        //   .text(function(d){
        //     return d[1]
        //   });
        //
        //   const exit = update.exit().remove();
        //
        //   update.merge(enter).selectAll('circle').attrs({
        //       r: 5
        //     })
        //   .attr('class', function(d){
        //     d[0]
        //   })
        //
        //
        //   const simulation = d3.forceSimulation(enter)
        //   .velocityDecay(0.2)
        //   .force('center', d3.forceCenter(200, 200))
        //   .force("y", d3.forceY(0))
        //   .force("x", d3.forceX(0))
        //   .alpha(1).restart();
        //
        //   simulation.stop();
        //
        //
        //   simulation
        //     .nodes(pkg.dependencies)
        //     .on('tick', ticked)
        //     .alpha(1).restart();
        //
        //   function ticked(){
        //     enter
        //     .attr('x', (d) => {
        //       console.log(d.x)
        //       return d.x})
        //     .attr('y', (d) => { return d.y}) //refer to labels
        //     .attr('transform', function(d) {
        //       return 'translate('  + d.x + ',' + d.y + ')'
        //     })
        //   }
        // }



        const title = d3.select('.title').append('g')

        const buildInformation = function(pkg){
          function capitalize(str){
            return str.charAt(0).toUpperCase() + str.slice(1)
          }

          //don't bind the data, just use
          // for loops to bind the data
          //to span elements and change the inner html
          //hardcode all inside the html and focus on the arts that matter



          function buildTitle() {
            const update = title.selectAll('span')
            .data(pkg.title);
            const enter = update.enter()
            .append('span').attr('class', function(d){
                      return d[0]})

            const exit = update.exit().remove();


            update.merge(enter).text(function(d){
              return  d[1]});
          }


          function buildForks() {
            document.getElementById('forks').innerText = pkg.forks[1];
          }

          function buildStars(){
            const star = '\u2605'; //U+2606 for other star
            document.getElementById('stars').innerText = star + ' ' + pkg.stars[1]
          }

          function buildSS(){
            for (let i = 0; i < subScoreHeading.length; i++){
              for(let j = 0; j < 4; j++){
                document.getElementById(subScoreHeading[i] + j).innerText = pkg.subScores[i][j][1]  //set up pretty print
              }
            }
          }

          buildSS()
          buildTitle()
          buildForks()
          buildStars()
        }



        const legend = scores.append('g')
          .attr('class', 'legend')
          .attr('text-anchor', 'end')
          .selectAll('g')
          .data(scoreHeading)
          .enter().append('g')
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append('rect')
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);

          legend.append('text')
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });


        const buildScoresChart = scores.append('g') //maybe refactor into a single function with a let scoresChart at the beginning
          .selectAll('g')
          .data(data);

          buildScoresChart
          .enter()
          .append('g')
          .on('click', function(e){
            // send data for the entire group, not the individual bar
            handleClick(e)})
          .on('mouseover', function(e){
            handleMouseOver(e, this)})
          .on('mouseover', function(e){
            handleMouseOut(e, this)})
          .attr('transform', (d) => {
            //console.log(d)
            return 'translate(' + sX0(d.title[1]) + ',0)';
          })
          .selectAll('rect')
          .data(function(d) { //pass a loop of data
            //console.log(d)
            return d.scores})
          .enter().append('rect')
          .merge(buildScoresChart)
            .attrs({
              x: (d, i) => {return sX1(d[0])},
              y: (d, i) => {return y(d[1])},
              width: (d) => {return sX1.bandwidth()},
              height: (d) => {return height - y(d[1])},
              fill: (d) => {return color(d[0])}
            })

            buildScoresChart.exit().remove();


        scores.append('g')
        .attr('class', 'axis')
        .attr("transform", "translate(0," + 450 + ")")
        .call(d3.axisBottom(axisScale.domain(pkgNames)))
        .selectAll('text')
        .attr('transform', 'rotate(90)')  //they neeed to be shifted down to fit














/*


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


//cognitive stability
//deltas matter- i only care about the changes- a sparse matrix




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
