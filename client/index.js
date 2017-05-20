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


        const h = window.innerHeight / 2,
        w = window.innerWidth / 2,
        margin = {top: 50, right: 500, bottom: 50, left: 100};

        const dependencies = d3.select('.dependencies')
        .attr('width', w + margin.right + margin.left)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // .attr("width", w + margin.right + margin.left)
        // .attr("height", h + margin.top + margin.bottom)

        const outdated = d3.select('.outdatedDependencies').append('ul');


      const buildDependencies = function(pkg){

          const treemap = d3.tree()
          .size([h, w/2]);


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
          return 30 })
          .style("text-anchor", function(d) {
          return d.children ? "start" : "start"; })
          .text(function(d) { return d.data.name; });

          updateNodes.merge(enterNodes)

          const exitNode = updateNodes.exit().remove();


}


        const title = d3.select('.title').append('g')

        const buildInformation = function(pkg){

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

          function buildDescription(){
            document.getElementById('description').innerText = pkg.description;
          }

          function buildOutdated(){
            let outdatedDependencies = outdated.selectAll('li')
            .data(pkg.outdatedDependencies[0] || [])

            outdatedDependencies
            .enter()
            .append('li')
            .merge(outdatedDependencies)
            .text(
              function(d){

                return 'Outdated Dependency: ' + d;
              })

            outdatedDependencies.exit().remove()
          }

          function buildSS(){

            for (let i = 0; i < subScoreHeading.length; i++){
              document.getElementById(subScoreHeading[i] + 'H').innerText = pkg.scores[i][1]
              for(let j = 0; j < 4; j++){
                document.getElementById(subScoreHeading[i] + j).innerText = pkg.subScores[i][j][1]  //set up pretty print
              }
            }
          }






          buildSS()
          buildTitle()
          buildForks()
          buildStars()
          buildOutdated()
          buildDescription()
        }


        console.log(d3.select('.legend')._groups[0][0].clientWidth);


        const legend = d3.select('.legend').append('g')
          .attr('text-anchor', 'end')
          .selectAll('g')
          .data(scoreHeading)
          .enter().append('g')
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append('rect')
          .attr("x",  50)  //here had width
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);

          legend.append('text')
          .attr("x", 40)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) {

            return d; });


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



*/
    })

}
