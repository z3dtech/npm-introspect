const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const parse = require('./parse');



var query = function(requests){
Promise.map(requests, request.get, {concurrency: 4}).then(function(results) {

  //fs.writeFile('here.json', results)
  var data1 = pkgInfoParse(results)
  console.log(data1)
  fs.writeFile('new.json', data1, (err) => {
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
/*
remove all weird characters, next try to stringify and then parse the returned
object
  s = s.replace(/\\n/g, "\\n")
                 .replace(/\\'/g, "\\'")
                 .replace(/\\"/g, '\\"')
                 .replace(/\\&/g, "\\&")
                 .replace(/\\r/g, "\\r")
                 .replace(/\\t/g, "\\t")
                 .replace(/\\b/g, "\\b")
                 .replace(/\\f/g, "\\f");
  // remove non-printable and other non-valid JSON chars
  s = s.replace(/[\u0000-\u0019]+/g,"");
  var o = JSON.parse(s);
*/


var pkgInfoParse = function(pkgInfo){
//make this loop through each part and parse(maybe)
//then grab a list of all the headlines I want
//check with matt about error handling
//later optimize this
let parsedPkg ={}
pkgInfo = pkgInfo.replace(/\\n/g, "\\n")
                 .replace(/\\'/g, "\\'")
                 .replace(/\\"/g, '\\"')
                 .replace(/\\&/g, "\\&")
                 .replace(/\\r/g, "\\r")
                 .replace(/\\t/g, "\\t")
                 .replace(/\\b/g, "\\b")
                 .replace(/\\f/g, "\\f");

pkgInfo = pkgInfo.replace(/[\u0000-\u0019]+/g,"");

  try {parsedPkg =
      JSON.parse(pkgInfo)
  } catch(e){
   console.log(e)
  }

  let filteredInfo = {}

  //for (let pkg in parsedPkg){
  parsedPkg.forEach((pkg) =>{

    filteredInfo['score'] = pkg.score //in the case of undefined
    filteredInfo['evaluation'] = pkg.evaluation
    console.log(typeof pkg)
        console.log(pkg.collected)

    //fs.writeFile("test.json", pkg + '-------------------------------------')
    return filteredInfo
  })
}
    //lets grab dependencis and pkg info
    //we'll parse first and append to new object the parts we want
    //with error handling for undefined




//query(["https://api.npms.io/v2/package/d3", "https://api.npms.io/v2/package/react"])
