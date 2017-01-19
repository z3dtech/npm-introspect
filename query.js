const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const parse = require('./parse.js')


var urls

parse((x, err) => {
  if(err) console.log(err);
  urls = x;
  console.log(urls)
});
  console.log(urls)
  console.log(typeof urls)
  /*
  console.log(typeof urls)
  var requests = urls.map((key, index) => {
     console.log(urls[key])
    console.log(index)//'https://api.npms.io/v2/package/' )
  })
  //console.log(requests)

*/



/*
var requests = [{
  url: 'https://api.npms.io/v2/package/d3',
}, {
  url: 'https://api.npms.io/v2/package/react',
}, {
  url: 'https://api.npms.io/v2/package/bluebird',
},
{
  url: 'https://api.npms.io/v2/package/react-router',
},
{
  url: 'https://api.npms.io/v2/package/webpack',
}];

Promise.map(requests, function(obj) {
  return request(obj).then(function(body) {
    return JSON.parse(body);
  });
}).then(function(results) {
  console.log(results);
  for (var i = 0; i < results.length; i++) {
  //  console.log(results)
  }
}, function(err) {
  // handle all your errors here
  console.log(err)
});


//use a stream ot pipe data and filter
/*
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));
var urls = ["https://api.npms.io/v2/package/d3"]//, "https://api.npms.io/v2/package/react", "https://api.npms.io/v2/package/bluebird"];
var sites = ['http://www.google.com', 'http://www.example.com', 'http://www.yahoo.com']

Promise.map(urls, request.get, {concurrency: 4}).then(function(results) {
  console.log(results);
}, function(err) {
    console.log(err);
});
///////////////////////////////////////////////////////

/
//
// let requests = []
// requests.push(got('https://api.npms.io/v2/package/d3'))
// requests.push(got('https://api.npms.io/v2/package/react'))
// requests.push(got('https://api.npms.io/v2/package/bluebird'))
//
//
// function doNext(){
//   if(!requests.length) return;
//   requests.shift().then((resolved) =>{
//   if(resolved.property === "Success"){
//     doNext();
//   }else{
//     let file = fs.createWriteStream('data.json');
//     let stream = resolved.pipe(file);
//     stream.on('finish', () =>{
//
//     doNext();
//   });
// }
//
// })
// }
// doNext();

*/
