'use strict'
var chartHide, spinMount, spinner, template, maxPackages;

var height = window.innerHeight,
    width = window.innerWidth,
    scoreWidth = width * 0.5,
    scoreHeight = height * 0.30,
    line = d3.line(),
    axis = d3.axisLeft(),
    y = d3.scaleLinear()
      .domain([1, 0])
      .range([0, scoreHeight]),
    vertAxis = d3.scaleLinear()
      .domain([1, 0])
      .range([0, scoreHeight]),
    fontScale = d3.scaleLinear()
      .domain([0,80])
      .range([15,4]),
    color = d3.scaleOrdinal().range(["#82A07D","#5D796A", "#425351","#2C2F32"]); //add colors

const spinOptions = {
      lines: 17,
      length: 12,
      width: 5,
      radius: 40,
      color: "#5D796A",
      scale: 1.75,
      speed: 1.9,
      trail: 60,
      corners: 1.0,
      opacity: 0,
      className: 'spinner',
    };

    chartHide = document.getElementsByClassName('scoreChart')[0].style;
    chartHide.visibility='hidden';
    spinMount = document.getElementById('spinner')

window.onload = function(  ) {
    template = document.getElementById( "content-wrapper" ).innerHTML;
    spinner = new Spinner(spinOptions).spin(spinMount);
    const url = '/data.json'
    d3.request(url).mimeType('application/json').response(function(xhr) {
        let parsedData = JSON.parse( JSON.parse(xhr.responseText) );
        for( var i = 0; i < parsedData.length; i++ ) {
          updateSearch( parsedData[ i ].title[0][1] );
        }
        return [JSON.parse(xhr.responseText), xhr.responseText];
    }).get(buildVisualization)

    }
 function buildVisualization(error, rawData) {
        if (error) {
          console.log(error);
          console.log(error.currentTarget.status)
          spinner.stop();
          const respError = document.createElement('p');
          respError.className = 'error';
          respError.innerText = 'response error ' + error.currentTarget.status + '\n error code in console';
          spinMount.appendChild(respError);
        }
        maxPackages = getPackageCount();
        let data;
        try{
          data = JSON.parse(rawData[0]).reverse();
          if( data.length > maxPackages ) {
            data = data.slice( 0, maxPackages );
          }
        }catch(error){
          console.log(error)
          console.log(rawData[1])
          spinner.stop();
          const parseErr = document.createElement('p');
          parseErr.className = 'error';
          parseErr.innerText = 'response error,\n package ' + JSON.parse(rawData[1]).options.uri.match(/\/([^\/]+)\/?$/)[1] + ' not found, \n error code in console';
          spinMount.appendChild(parseErr);
        }
        spinner.stop();

        //console.dir(data)
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
        const groupScoreWidth = (width/20) * data.length,
        groupBand = d3.scaleBand()
          .rangeRound([0, groupScoreWidth])
          .paddingInner(0.3),
        barBand = d3.scaleBand()
          .padding(0.05);

        const subScoreHeading = ['quality', 'popularity', 'maintenance'];
        const scoreHeading = ['Quality', 'Popularity', 'Maintenance', 'Final']

        groupBand.domain(pkgs)
        barBand.domain(scoreHeading).rangeRound([0, groupBand.bandwidth()]);

        const scoreScale = (function(){
          let scale = [[], [], [], []];
          for (let pkg in data){

            data[pkg].scores.forEach((cat, i) => {
              scale[i].push(data[pkg].scores[i][1])
              })
            }
            return scale
          })()

        chartHide.visibility='visible'

        const scoresContainer = d3.select('.scoreChart')
          .attr('width', scoreWidth)
          .attr('height', scoreHeight)

        const scores = d3.select('.scores')
          .attr('width', groupScoreWidth)
          .attr('height', scoreHeight)

        const handleClick = function(e, that){
          console.log( e )
          buildInformation(e)
          buildDependencies(e)
        }

        const margin = {top: 50, right: 500, bottom: 50, left: 100},
        depWidth = width * .6,
        depHeight = height * .45;

        const dependencies = d3.select('.dependencies')
        .attr('width', depWidth + margin.right + margin.left)
        .attr('height', depHeight + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const outdated = d3.select('.outdatedDependencies').append('ul');

        const computeNodeCount = function(node){
          let nodeCount = 0;
          for(let i = 0; i < node.parent.parent.children.length; i++){
            nodeCount += node.parent.parent.children[i].children.length
          }
          return nodeCount
        }

        const buildDependencies = function(pkg){

          const treemap = d3.tree()
          .size([depHeight, depWidth]);

          d3.selectAll('g.node').remove() //workaround because the root will not remove properly

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

           updateLinks.merge(enterLinks)
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr("d", function(d) {
                      return "M" + d.y + "," + d.x
                        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                        + " " + d.parent.y + "," + d.parent.x;
                      });

          const updateNodes = dependencies.selectAll("g.node")
          .data(nodes.descendants(), d => d);

          const enterNodes = updateNodes.enter().append("g")
          .attr("class", function(d) {
                return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
          .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")"; });

          enterNodes.append("circle")
          .attr("r", function(d) { return 15; });

          enterNodes.append("text")
          .attr("dy", ".25em")
          .attr("x", 25)
          .style("text-anchor", "start")

          .style("font-size", function(d){
            let fontSize
            if (d.depth == 0) {
              fontSize = 23;
            }
            else if (d.depth == 1){
              fontSize = 17
            }
            else{
              const nc = computeNodeCount(d)
              if (nc >= 70){fontSize = 4}
              else{fontSize = fontScale(computeNodeCount(d))}

            }
            return fontSize;
          })
          .text(function(d) { return d.data.name; }).on("click", function( d,i ) { 
              updateSearch( d.data.name, true )
          });

          updateNodes.merge(enterNodes);

          const exitNode = updateNodes.exit().remove();
        }

        const title = d3.select('.title').append('g')


        const buildInformation = function(pkg){

          function buildTitle() {
            const update = title.selectAll('span')
            .data(pkg.title);
            const enter = update.enter()
            .append('span').attr('class', function(d){
                      return d[0]});
            const exit = update.exit().remove();
            update.merge(enter).text(function(d){
              return  d[1]});
            // make it a link? discussable
            $( "div.title" ).html( "<a target='_new' href='https://www.npmjs.com/package/"+$( "span.name" ).text()+"'>"+$( "div.title" ).html()+"</a>" );
          }

          function buildForks() {
            const forkMount = document.getElementsByClassName('forks')[0];
            while (forkMount.hasChildNodes()){
              forkMount.removeChild(forkMount.lastChild);
            }
            const fork = document.createElement('img');
            fork.src = 'fork.png';
            fork.alt = 'Fork Count';
            const forkCount = document.createElement('span');
            forkCount.id = 'forks';
            forkCount.innerText = pkg.forks[1];
            forkMount.appendChild(fork);
            forkMount.appendChild(forkCount);
          }
          function buildStars(){
            const star = '\u2605'; //U+2606 for other unicode star
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
              }).on( 'click', function( e ) {
              updateSearch( e, true );
            } )
            outdatedDependencies.exit().remove()
          }

          function buildSS(){
            document.getElementById('finalScore').innerText = pkg.scores[3][0] + ': ' + pkg.scores[3][1].toFixed(2);
            for (let i = 0; i < subScoreHeading.length; i++){
              document.getElementById(subScoreHeading[i] + 'H').innerText = pkg.scores[i][0] + ': ' + pkg.scores[i][1].toFixed(2)
              for(let j = 0; j < 4; j++){
                document.getElementById(subScoreHeading[i] + j).innerText = pkg.subScores[i][j][0] + ': ' + pkg.subScores[i][j][1].toFixed(2)  //set up pretty print
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

        const legend = d3.select('.legend').append('g')
          .attr("transform", () => { return "translate(0," + 20 + ")"; })
          .attr('text-anchor', 'start')
          .selectAll('g')
          .data(scoreHeading)
          .enter().append('g')
          .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

          legend.append('rect')
          .attr("x",  20)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color);

          legend.append('text')
          .attr("x", 45)
          .attr("y", 12)
          .text(function(d) {
            return d; });

        handleClick(data[0])
        const buildScoresChart = scores.append('g')
          .selectAll('g')
          .data(data);

          buildScoresChart
          .enter()
          .append('g')
          .on('click', function(e){
            handleClick(e)})
          .attr('transform', (d) => {
            return 'translate(' + groupBand(d.title[1]) + ',0)';
          })
          .on('mouseover', function() {
           d3.selectAll(this.childNodes).style('fill', function(d){
             let bar = d3.select(this).style('fill')
             return d3.rgb(bar).darker(2)
           })
          })
          .on('mouseout', function() {
           d3.selectAll(this.childNodes).style('fill', function(d){
             let bar = d3.select(this).style('fill')
             return d3.rgb(bar).brighter(2)
           })
          })
          .selectAll('rect')
          .data(function(d) {
            return d.scores})
          .enter().append('rect')
          .merge(buildScoresChart)
          .attr('x', (d, i) => {return barBand(d[0])})
          .attr('width', (d) => {return barBand.bandwidth()})
          .attr('fill', (d) => {return color(d[0])})
          // .attr('height', 0) //comment out for vertical drop
          // .attr('y', height) //comment out for vertical drop
          .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .delay((d, i) => {return i * 400})
            .attr('height', (d) => {return height - y(d[1])})
            .attr('y', (d, i) => {return y(d[1])})

            buildScoresChart.exit().remove();

        scores.append('g')
        .attr('class', 'axis')
        .attr("transform", "translate(" + [0, (scoreHeight/2)]  + ")")
        .call(d3.axisBottom(groupBand.domain(pkgNames)))
        .selectAll('text')
        .attr('text-anchor', 'center')
        .attr('transform', 'rotate(90)')

        // vertical axis
        // scores.append('g')
        // .attr('class', 'axisVertical')
        // .attr("transform", "translate(" + [25, 0]  + ")")
        // .call(d3.axisLeft(vertAxis)) //no right s

        
      }



window.addEventListener('resize', function( e ) {
  if( maxPackages !== getPackageCount() ) {
    width = window.innerWidth;
    height = window.innerHeight;
    triggerBuild()
    spinner.stop();
  }
});

document.getElementById( "upload" ).addEventListener( "change", function() {
  if( document.getElementById( "upload" ).value !== "" ) {
      let input = this.files[0];
      let reader = new FileReader();
      reader.onload = function(){
        document.getElementById( "searchBar" ).options.length = 0;
        let dependencies = Object.keys( JSON.parse( reader.result ).dependencies );
        for( var i = 0; i < dependencies.length; i++ ) {
          updateSearch( dependencies[ i ], false );
        }
        let devDependencies = Object.keys( JSON.parse( reader.result ).devDependencies );
        for( var i = 0; i < devDependencies.length; i++ ) {
          updateSearch( devDependencies[ i ], false );
        }
       triggerBuild();
      };
      reader.readAsText( input );
  }
   document.getElementById( "upload" ).value = "";
})

document.getElementById( "searchButton" ).addEventListener( "click", function() {
 triggerBuild();
});

/* Select2 hacks start here */

var input = "";
$( "#searchBar" ).select2({
  tags: true,
}).on("select2:select", function(e) {
  if( $(this).val().indexOf( e.params.data.text ) === -1 ){
    $(this).find('[value="'+e.params.data.id+'"]').replaceWith(new Option( e.params.data.text, e.params.data.text, true, true ) );  
  }
});
$( ".select2-container" ).keyup(function( e ){
    if(e.which == 13 ) { //Enter keycode
      let currentSearch = $( "#searchBar").val();;
      let startsWith = false;
      currentSearch.forEach(function(search) {
        console.log( search );
        console.log( input );
        console.log( search.toLowerCase().startsWith( input.toLowerCase() ) );
          if( search.toLowerCase().startsWith( input.toLowerCase() ) ) {
            startsWith = true;
          }
      });
      if( currentSearch.indexOf( input ) !== -1 ) { 
        document.getElementById("searchBar").querySelector("option[value='"+ input +"']").remove();
        updateSearch( input );
      } else if( startsWith ) {
        updateSearch( input );
      }
    } else {
      input = document.getElementById("select2-searchBar-results").querySelector( "li" ).innerText;  
    }
  });

/* End of select2 hacks */


const triggerBuild = function() {
  $( ".error" ).remove();
  let pkg = $( "#searchBar" ).val();
  if( !pkg || pkg.length === 0 ) {
    return;
  }
  for( let i = 0; i < pkg.length; i++ ) {
    if( pkg[i].indexOf( "/" ) !== -1 ) {
      pkg[i] = pkg[i].match(/\/([^\/]+)\/?$/)[1];
    }
  }
  document.getElementById( "content-wrapper" ).innerHTML = template;
  spinner = new Spinner(spinOptions).spin(spinMount)
  let search = "/search/"+pkg;  
  d3.request(search).mimeType('application/json').response(function(xhr) {
    return [JSON.parse(xhr.responseText), xhr.responseText];
  }).get(buildVisualization); 
  document.getElementsByClassName( "scores" )[0].style.visibility = "visible";
  return true;
}

const updateSearch = function( name, triggerUpdate ) {
  if( typeof name === "undefined" || !name || name === "" ) {
    return false;
  }
  let curSearch = document.getElementById( "searchBar" ).value;
  if( curSearch.indexOf( 'name' ) === -1 ) {
    document.getElementById( "searchBar" ).appendChild( new Option( name, name, true, true ) )
  } else {
    document.getElementById( "#searchBar" ).querySelector( "option[value='"+ name +"']" ).remove();
  }
  if( triggerUpdate ) {
    document.getElementById( "searchButton" ).trigger( "click" );
  }
} 

const getPackageCount = function() {
  return Math.round( innerWidth / 150 ); 
}
