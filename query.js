const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const parse = require('./parse');



var query = function(requests){
Promise.map(requests, request.get, {concurrency: 4}).then(function(results) {

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





//query(["https://api.npms.io/v2/package/d3", "https://api.npms.io/v2/package/react"])
