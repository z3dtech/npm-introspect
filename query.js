

const fs = require('fs');
const Promise = require('bluebird')
//const request = Promise.promisify(require('request'));
const got = require('got');

//var sites = ['http://www.google.com', 'http://www.example.com', 'http://www.yahoo.com']

// var requests = sites.map(request)
// Promise.all(requests).then(function(results){
//   console.log(results)
//    console.log("All done") // you can access the results of the requests here
// });

var requestss = ["https://api.npms.io/v2/package/d3", "https://api.npms.io/v2/package/react", "https://api.npms.io/v2/package/bluebird"];

let requests = []
requests.push(got('https://api.npms.io/v2/package/d3'))
requests.push(got('https://api.npms.io/v2/package/react'))
requests.push(got('https://api.npms.io/v2/package/bluebird'))


function doNext(){
  if(!requests.length) return;
  requests.shift().then((resolved) =>{
  if(resolved.property === "Success"){
    doNext();
  }else{
    let file = fs.createWriteStream('data.json');
    let stream = resolved.pipe(file);
    stream.on('finish', () =>{

    doNext();
  });
}

})
}
doNext();
//or break up the handler to a controller and Promisified handler:
//
// function streamOrNot(obj){
// return new Promise(resolve, reject){
// if(obj.property === something){
//   resolve();
//   return;
// }
// let filetodomvc.com
//   resolve();
// });
// }
// }
//
// function doNext(){
// if(!requests.length) return;
// return requests.shift().then(streamOrNot).then(doNext);
// }
