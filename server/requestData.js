/*
I should look at rewriting this with respect to https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
and see if instead of returning new promises if I should just be returning the promise
- returning the promise should allow me to chain it where the follwoing then is
invoke upon resolve, If I don't return the function then the next then would recience undefined

Always return or throw inside a .then, you can also return synchronous or asynchronous
and the second function won't care

use Promise.resolve instead of doing new Promise(funciton(reject, resolve)...)
for synchronous code I can def use this somewhere

Then has to be passed a function, not a promise- which will evaluate to null, what you should do
is wrap that returned promise in a function


/////Chnage N/A stars to 0 and forks 0

doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);


doSomething().then(doSomethingElse)
  .then(finalHandler);
*/

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
              console.log('error in parse ln 39' + data)
              reject(error)
            }
            let contents = JSON.parse(data); //try and catch all the JSON parse, reject(new Error('OH SHiT'))
            let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
            //console.log(packages)
            resolve(packages)
        });
    });
}

const npmSearchQuery = function(requests) {
    // console.log('made it to query' + requests)
    return Promise.map(requests, request.get, {concurrency: 1}).then(function(apiResults) {
        return pkgInfoParse(apiResults)
    }).catch(function(error) {
        return 'npmSearch: ' + error
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
            console.log(error)
        }

        filteredPkg.title = [['name', parsedPkg.collected.metadata.name], ['version', 'v' + parsedPkg.collected.metadata.version]]
        filteredPkg.stars = ['stars',  parsedPkg.collected.github && parsedPkg.collected.github.starsCount
            ? parsedPkg.collected.github.starsCount
            : 0]

        filteredPkg.forks = ['forks', parsedPkg.collected.github && parsedPkg.collected.github.forksCount
            ? parsedPkg.collected.github.forksCount
            : 0]

        filteredPkg.vulnerabilities = [parsedPkg.collected.source && parsedPkg.collected.source.vulnerabilities ? parsedPkg.collected.source.vulnerabilities : null];
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

        filteredPkg.test = ['testScript', parsedPkg.collected.metadata.hasTestScript]
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
    console.log(userPkgs)
      return new Promise((resolve, reject) => {
          parsePkgJSON().then((packages) => {
             packages.push(...userPkgs)
             console.log(packages)
              let packageUrls = packages.map((name) => {
                  return "https://api.npms.io/v2/package/" + name
              })
              npmSearchQuery(packageUrls).then(function(result) {

                  fs.writeFile('data1.json', result, (err) => {
                      if (err) {
                          throw err;
                      }
                      //console.log('data logged')
                  })

                  resolve(result)
              }).catch(function(error) {
                  reject('here is an error' + error)
              })
          })
      })
  }
