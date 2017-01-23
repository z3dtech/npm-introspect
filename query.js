const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const parse = require('./parse');



var query = function(requests){
Promise.map(requests, request.get, {concurrency: 4}).then(function(results) {
  var data1 = dataParse(results)
  console.log(data1)
  fs.writeFile('new.json', results, (err) => {
    if (err) throw err;
    console.log('done')
  })
}, function(err) {
    console.log(err);
});
}


parse().then((packages) => {
  let packageUrls = packages.map((name) => {
    return "https://api.npms.io/v2/package/" + name
  })
    //console.log(packageUrls)
    query(packageUrls) //.pipe(fs.createWriteStream('neo.json'))

  })

var dataParse = function(dataBody){
//make this loop through each part and parse(maybe)
//then grab a list of all the headlines I want
//check with matt about error handling
//later optimize this
  var cData = JSON.parse(dataBody[1])
  var cleanData = cData.collected
  return cleanData
}



//query(["https://api.npms.io/v2/package/d3", "https://api.npms.io/v2/package/react"])
