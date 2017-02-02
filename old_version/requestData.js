#!/usr/bin/env node

const fs = require('fs');
const path = require('path')
const Promise = require("bluebird");
const request = require('request-promise');

//function that takes a pkg name and does a get search
//then passes to parse function

var parsePkgJSON = function (){
   return new Promise((resolve, reject) => {
     fs.readFile(path.resolve(_dirname + 'package.json'), 'utf-8', (err, data) => {
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


    filteredPkg['name'] = parsedPkg.collected.metadata.name;
    filteredPkg['version'] = parsedPkg.collected.metadata.version;
    filteredPkg['dependencies'] = parsedPkg.collected.metadata.dependencies;
    filteredPkg['devDependencies'] = parsedPkg.collected.metadata.devDependencies;
    filteredPkg['peerDependencies'] = parsedPkg.collected.metadata.peerDependencies;
    filteredPkg['downloadsAcceleration'] = parsedPkg.collected.npm.downloads;
    filteredPkg['github.starsCount']= parsedPkg.collected.github.starsCount;
    filteredPkg['github.forksCount']= parsedPkg.collected.github.forksCount;
    filteredPkg['outdatedDependencies']= parsedPkg.collected.source.outdatedDependencies;
    filteredPkg['vulnerabilities']= parsedPkg.collected.source.vulnerabilities;
    filteredPkg['score'] = parsedPkg.score;
    filteredPkg['evaluation'] = parsedPkg.evaluation;

    filteredInfo.push(filteredPkg)

  })
  return JSON.stringify(filteredInfo)
}
