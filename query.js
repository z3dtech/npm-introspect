const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');

var parsePkgJSON = function (){
   return new Promise((resolve, reject) => {
     fs.readFile('./package.json', 'utf-8', (err, data) => {
       if (err) reject(err)
       let contents = JSON.parse(data);//try and catch all the JSON parse, reject(new Error('OH SHiT'))
       let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
       resolve(packages)
   });
  });
}

var npmSearchQuery = function(requests){
Promise.map(requests, request.get, {concurrency: 4}).then(function(apiResults) {
  let filteredNPM = pkgInfoParse(apiResults)

  fs.writeFile('data.json', filteredNPM, (err) => {
    if (err) throw err;
    console.log('done')
  })
}, function(err) {
    console.log(err);
});
}


parsePkgJSON().then((packages) => {
  let packageUrls = packages.map((name) => {
    return "https://api.npms.io/v2/package/" + name
  })
    npmSearchQuery(packageUrls)
  })

var pkgInfoParse = function(pkgInfo){
/*
Use in case I abstract parse from the loop and need to pull out odd characters
pkgInfo = pkgInfo.replace(/\\n/g, "\\n")
                 .replace(/\\'/g, "\\'")
                 .replace(/\\"/g, '\\"')
                 .replace(/\\&/g, "\\&")
                 .replace(/\\r/g, "\\r")
                 .replace(/\\t/g, "\\t")
                 .replace(/\\b/g, "\\b")
                 .replace(/\\f/g, "\\f");
pkgInfo = pkgInfo.replace(/[\u0000-\u0019]+/g,"");
*/
  let filteredInfo = []

  pkgInfo.forEach((pkg) =>{
    let parsedPkg = {}
    let filteredPkg = {}

    try {parsedPkg =
        JSON.parse(pkg)
    } catch(e){
     console.log(e)
    }

    filteredPkg['score'] = parsedPkg.score
   //add try/catch for more complex calls
    filteredPkg['evaluation'] = parsedPkg.evaluation

    filteredInfo.push(filteredPkg)

  })
  return JSON.stringify(filteredInfo)
}
