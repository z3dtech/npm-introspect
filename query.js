

const fs = require('fs');

//const request = Promise.promisifyAll(require('request'));
const got = require('got');

// const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require('fs'));
// const files = ["file1.txt", "fileA.txt", "fileB.txt"];
//
// Promise.map(files, fs.readFileAsync).then(function(results) {
//     // files data in results Array
// }, function(err) {
//     // error here
// });

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
// const request = require('request');
//
// function requestAsync(url, options) {
//     return new Promise(function(resolve, reject) {
//         request.get(url, options, function(err, data) {
//             if (err) {
//                 reject(err);
//             } else {
//                  resolve(data);
//             }
//         });
//     });
// }
//
// requestAsync('https://api.npms.io/v2/package/d3').then(function(data) {
//    console.log(data);
// });

// var requests = sites.map(request)
// Promise.all(requests).then(function(results){
//   console.log(results)
//    console.log("All done") // you can access the results of the requests here
// });

// var requestss = ["https://api.npms.io/v2/package/d3", "https://api.npms.io/v2/package/react", "https://api.npms.io/v2/package/bluebird"];
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

//Promise.mapSeries()
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
