window.onload = function (){

  //lets check request data and see what we should get rid of
  //then transform the data and finish the visuals
  //when transform use two different objects to store
  //one for the score and one for the

  const datum =[
  //{name: ['async', 'bluebird', 'webpack', 'request']},
    .8888, .46464, .66663, .96706, .84071299, .86868, .63636, .96969
  ]

  const coors = [
    {x: 45, y: 120},
    {x: 60, y: 120},
    {x: 25, y: 23}
  ]


  /*
6 by 4 = 36 calls
3 by 4 = 9 calls
4 by 5 = 16 calls
1 by 5 = 25 calls






  */

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
    //console.log(data)

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



          //this guy has to seperate the paths functio better
          //its all getting fucked up by the return statements

      //const createPaths = function(d){
        //console.log(d)

        //the part where this is called four times
        //for (let i = 0; i < keys.length; i++){


              //return y(keys[value])
            //}).call()
      //  }

      // const path = function(data, value){
      //   const gh = d3.line()
      //   .x(function(d, i) {
      //     return 100 * i; })
      //   .y(function(d, i) {
      //     //console.log(keys[i])
      //     return y(d.value)
      //   })
      //    return gh(data)
      //
      // }

      console.log('no error so far')


      const path = d3.line()
        .x(function(d, i) {
           return 100 * i; })
        .y(function(d, i) {
           //console.log(keys[i])
           console.log(i)
           console.log(d)
           return y(.5)    //here is
         })


      //  const path2 = d3.line()
      //    .x(function(d, i) {
      //       return 100 * i; })
      //    .y(function(d, i) {
      //       //console.log(keys[i])
      //       return y(d.popularity)
      //     })

      // const path = d3.line()
      //     .x(function(d) {
      //       return d.final * 200; })
      //     .y(function(d) {
      //       return y(d.maintenanc); });

      //this should be wraqpped and called more itmes


      const paths = g.append('g')
        .attr('class', 'score')
        .selectAll('paths')
        .data(data)
        .attr('d', data.map((d) => {
             d.score.detail['final'] = d.score.final
        }))
        .enter()
        // .each((d, i) => {
        //   console.log(d.score.detail)
        //   console.log(i + ' ---------')
        // })
        .append('g')
        .attr('transform', 'translate(' + [0, 0] + ')')
        .attr('d', (d) => {
            d.score.detail.each(d, i){
              console.log(i)
            }
          //return path()

        })



        // const paths = g.selectAll('paths')
        //
        //   .attr('class', 'lines')
        //   .data(data)
        //   .enter()


          //.append('g')
          //.attr('transform', 'translate(' + [10, 10] + ')')

          //.selectAll('paths')



        //   .selectAll('path')
        //   .attr('d', data.map((d) => {
        //     d.score.detail['final'] = d.score.final
        //   })
        // )
        //   .data(function(d){
        //     console.log(d.score.detail)
        //     return d.score.detail
        //   })
        //   //.enter()
        //   .append('g')
        //   .attr('d', (d) =>{
        //     console.log(d)
        //   })
        //   .append('path')
        //   .attr('d', () =>{
        //     console.log('here')
        //     console.log(d)
        //     return path(d)
        //   })
          // .selectAll('paths')
          // .data(function(d){
          //   return d.score.detail
          // })
          // .attr(function(d){
          //   console.log(d)
          // })



        // ()=> {
        //   let keys = ['score.detail.maintenance', 'score.detail.popularity', 'score.detail.quality', 'score.final']
        //   for(let i = 0; i < keys.length; i++){
        //       path(data, keys[i]);
        //   }
        // .attrs({
        //
        //   fill: none,,
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
