'use strict'

const fs = require('fs');
const path = require('path')
const Promise = require("bluebird");
const request = require('request-promise');



var parsePkgJSON = function (){
 return new Promise((resolve, reject) => {
   fs.readFile(path.resolve( '__dirname' + 'package.json'), 'utf-8', (err, data) => {
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
  console.log(filteredNPM)
//   fs.writeFile('data.json', filteredNPM, (err) => {
//     if (err) throw err;
//     console.log('done')
//   })
// }, function(err) {
//     console.log(err);
// });
})
};

var pkgInfoParse = function(pkgInfo){

  let filteredInfo = []

  pkgInfo.forEach((pkg) =>{
    let parsedPkg = {}
    let filteredPkg = {}

    try {parsedPkg =
        JSON.parse(pkg)
    } catch(e){
     console.log(e)
    }
    // filteredPkg['name'] = parsedPkg.collected.metadata.name;
    // filteredPkg['version'] = parsedPkg.collected.metadata.version;
    // filteredPkg['dependencies'] = parsedPkg.collected.metadata.dependencies;
    // filteredPkg['devDependencies'] = parsedPkg.collected.metadata.devDependencies;
    // filteredPkg['peerDependencies'] = parsedPkg.collected.metadata.peerDependencies;
    // filteredPkg['downloadsAcceleration'] = parsedPkg.collected.npm.downloads;
    // filteredPkg['github.starsCount']= parsedPkg.collected.github.starsCount;
    // filteredPkg['github.forksCount']= parsedPkg.collected.github.forksCount;
    // filteredPkg['outdatedDependencies']= parsedPkg.collected.source.outdatedDependencies;
    // filteredPkg['vulnerabilities']= parsedPkg.collected.source.vulnerabilities;
    // filteredPkg['score'] = parsedPkg.score;
    // filteredPkg['evaluation'] = parsedPkg.evaluation;
    //
    // filteredInfo.push(filteredPkg)
    filteredInfo.push(parsedPkg)

  })
  return JSON.stringify(filteredInfo)
}

///////////////////////////////////////////////

exports.go = () => {
  parsePkgJSON().then((packages) => {
  let packageUrls = packages.map((name) => {
    return "https://api.npms.io/v2/package/" + name
  })
    npmSearchQuery(packageUrls)
  })
}


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
