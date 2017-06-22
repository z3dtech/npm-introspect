'use strict'

const fs = require('fs');
const path = require('path')
const Promise = require("bluebird");
const request = require('request-promise');

const formatString = function(string) {
    string = string.replace(/([a-z])([A-Z])/g, '$1 $2')
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const parsePkgJSON = () => {
    return new Promise((resolve, reject) => { //the package.json address needs to be changed for root
        fs.readFile(path.resolve('package.json'), 'utf-8', (error, data) => {
            if (error){
              console.log('Cannot find package.json, please run in project root')
              reject(error)
            }
            let contents = JSON.parse(data); //try and catch all the JSON parse, reject(new Error('OH SHiT'))
            let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
            resolve(packages)
        });
    });
}

const npmSearchQuery = function(requests) {
    return Promise.map(requests, request.get, {concurrency: 6}).then(function(apiResults) {
        return pkgInfoParse(apiResults)
    }).catch(function(error) {
        return error
    })
}

const pkgInfoParse = function(pkgInfo) {
    let filteredInfo = []

    pkgInfo.forEach((pkg) => {
      //  if (!pkg) continue; // I need to know what end up here in the case of bad module
        let parsedPkg = {}
        let filteredPkg = {}

        try {
            parsedPkg = JSON.parse(pkg)

        } catch (error) {
            console.log(error + 'error in parseInfo')
        }

        filteredPkg.title = [['name', parsedPkg.collected.metadata.name], ['version', 'v' + parsedPkg.collected.metadata.version]]
        filteredPkg.stars = ['stars',  parsedPkg.collected.github && parsedPkg.collected.github.starsCount
            ? parsedPkg.collected.github.starsCount
            : 0]

        filteredPkg.forks = ['forks', parsedPkg.collected.github && parsedPkg.collected.github.forksCount
            ? parsedPkg.collected.github.forksCount
            : 0]

        filteredPkg.outdatedDependencies = [parsedPkg.collected.source && parsedPkg.collected.source.outdatedDependencies ? Object.keys(parsedPkg.collected.source.outdatedDependencies) : null];
        let dependencies = {"name": parsedPkg.collected.metadata.name,
                          "children": []};

        if (parsedPkg.collected.metadata.dependencies){
            let depChildren = [];
          Object.keys(parsedPkg.collected.metadata.dependencies).forEach((name) => {
            depChildren.push({'name': name});
          })
          dependencies.children.push({"name": "dependency", "children": depChildren})
        }
        if (parsedPkg.collected.metadata.devDependencies){
          let devDepChildren = [];
        Object.keys(parsedPkg.collected.metadata.devDependencies).forEach((name) => {
            devDepChildren.push({'name': name});
          })
          dependencies.children.push({"name": "devDependency", "children": devDepChildren})
        }
        if (parsedPkg.collected.metadata.peerDependencies){
          let peerDepChildren = [];
        Object.keys(parsedPkg.collected.metadata.peerDependencies).forEach((name) => {
            peerDepChildren.push({'name': name});
          })
          dependencies.children.push({"name": "peerDependency", "children": peerDepChildren})
        }

        filteredPkg.dependencies = dependencies;
        filteredPkg.description = parsedPkg.collected.metadata.description
        filteredPkg.scores = [['Quality', parsedPkg.score.detail.quality], ['Popularity', parsedPkg.score.detail.popularity], ['Maintenance', parsedPkg.score.detail.maintenance], ['Final', parsedPkg.score.final]];

        let category = ['quality', 'popularity', 'maintenance'];
        let subScores = [];
        for (let s in category){
          let sScores = []
          for (let c in parsedPkg.evaluation[category[s]]){
              sScores.push([formatString(c), parsedPkg.evaluation[category[s]][c]])
          }
          subScores.push(sScores)
        }
        filteredPkg.subScores = subScores;
        filteredInfo.push(filteredPkg)
    })
    return JSON.stringify(filteredInfo)
}

exports.parse = function(userPkgs) {
      return new Promise((resolve, reject) => {

          parsePkgJSON().then((packages) => {
             packages.push(...userPkgs)
              let packageUrls = packages.map((name) => {
                  return "https://api.npms.io/v2/package/" + name
              })
              npmSearchQuery(packageUrls).then(function(result) {
                  resolve(result)
              }).catch(function(error) {
                  reject(error)
              })
          })
      })
  }
