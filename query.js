const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const parse = require('./parse');

parse().then((packages) => {
  packages.map((x) => {
    "https://api.npms.io/v2/package/" + x
  })
    console.log(packages)
    //query(packages)

  })

  // var urls = ["https://api.npms.io/v2/package/d3"]//, "https://api.npms.io/v2/package/react", "https://api.npms.io/v2/package/bluebird"];
  // var sites = ['http://www.google.com', 'http://www.example.com', 'http://www.yahoo.com']
  //
  // Promise.map(urls, request.get, {concurrency: 4}).then(function(results) {
  //   console.log(results);
  // }, function(err) {
  //     console.log(err);
  // });


  var query = function(requests){
    Promise.map(requests, request.get, {concurrency: 4})
      .then(function(result) {
        console.log(result);
      }).catch(function(err){
        console.log(err);
      })
}

// var query = function(requests){
//   Promise.map(requests, (x) => {
//     request(x).then(function(body) {
//     return JSON.parse(body);
//   });
// })
// .catch(console.log())
// .then(function(results) {
//   console.log(results);
//   for (var i = 0; i < results.length; i++)
//   {
//       console.log(results)
//   }
// }, function(err) {
//   // handle all your errors here
//   console.log(err)
// });
// }

query("https://api.npms.io/v2/package/d3")

//use a stream ot pipe data and filter
/*
*
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
*/
