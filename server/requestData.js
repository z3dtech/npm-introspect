'use strict'

const fs = require('fs');
const path = require('path')
const Promise = require("bluebird");
const request = require('request-promise');


var parsePkgJSON = () => {
 return new Promise((resolve, reject) => {
   fs.readFile(path.resolve('package.json'), 'utf-8', (error, data) => {
     if (error) reject(error)
     let contents = JSON.parse(data);//try and catch all the JSON parse, reject(new Error('OH SHiT'))
     let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
     resolve(packages)
   });
  });
}

var npmSearchQuery = function(requests){
  return Promise.map(requests, request.get, {concurrency: 4})
    .then(function(apiResults) {
    return pkgInfoParse(apiResults)})
    .catch(function(error) {return error})

}

var pkgInfoParse = function(pkgInfo){
  let filteredInfo = []

  pkgInfo.forEach((pkg) => {
    let parsedPkg = {}
    let filteredPkg = {}

    try {parsedPkg =
        JSON.parse(pkg)
    } catch(error){
     console.log(error)
    }
    /*
    lets refactor this so that we are using a loop and try/catch and setting to
    0/undefined any thing that isn't very good 

    */
    filteredPkg['name'] = parsedPkg.collected.metadata.name;
    filteredPkg['version'] = parsedPkg.collected.metadata.version;
    filteredPkg['dependencies'] = parsedPkg.collected.metadata.dependencies;
    filteredPkg['devDependencies'] = parsedPkg.collected.metadata.devDependencies;
    filteredPkg['peerDependencies'] = parsedPkg.collected.metadata.peerDependencies;
    filteredPkg['downloadsAcceleration'] = parsedPkg.collected.npm.downloads;
    //filteredPkg['github.starsCount']= (parsedPkg.collected.github.starsCount || undefined);
    //filteredPkg['github.forksCount']= parsedPkg.collected.github.forksCount;
    filteredPkg['outdatedDependencies']= parsedPkg.collected.source.outdatedDependencies;
    filteredPkg['vulnerabilities']= parsedPkg.collected.source.vulnerabilities;
    filteredPkg['score'] = parsedPkg.score;
    filteredPkg['evaluation'] = parsedPkg.evaluation;

    filteredInfo.push(filteredPkg)
    //filteredInfo.push(parsedPkg)
  })
  return JSON.stringify(filteredInfo)
}

exports.parse =  function(){
  return new Promise((resolve, reject) => {
  parsePkgJSON()
  .then((packages) =>   {
    let packageUrls = packages.map((name) => {
      return "https://api.npms.io/v2/package/" + name
    })
      npmSearchQuery(packageUrls)
      .then(function(result) {
        resolve(result)
    }).catch(function(error) {reject(error)})
    })
  })
}


// exports.parse = function(){
//   return new Promise(resolve, reject){
//     requestData()
