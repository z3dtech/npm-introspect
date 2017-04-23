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

var parsePkgJSON = () => {
    return new Promise((resolve, reject) => { //the package.json address needs to be changed for root
        fs.readFile(path.resolve('package.json'), 'utf-8', (error, data) => {
            if (error)
                reject(error)
            console.log('error in parse' + data)
            let contents = JSON.parse(data); //try and catch all the JSON parse, reject(new Error('OH SHiT'))
            let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
            //console.log(packages)
            resolve(packages)
        });
    });
}

var npmSearchQuery = function(requests) {
    console.log('made it to query' + requests)
    var url = ['https://api.npms.io/v2/package/got', 'https://api.npms.io/v2/package/http']
    return Promise.map(requests, request.get, {concurrency: 1}).then(function(apiResults) {
        return pkgInfoParse(apiResults)
    }).catch(function(error) {
        return 'npmSearch: ' + error
    })

}

var pkgInfoParse = function(pkgInfo) {
    let filteredInfo = []
    //console.log('pkgInfo' + pkgInfo)

    pkgInfo.forEach((pkg) => {
      //  if (!pkg) continue; // I need to know what end up here in the case of bad module
        let parsedPkg = {}
        let filteredPkg = {}

        try {
            parsedPkg = JSON.parse(pkg)
        } catch (error) {
            console.log(error)
        }

        filteredPkg.information = [['name', parsedPkg.collected.metadata.name], ['version', parsedPkg.collected.metadata.version], ['stars', parsedPkg.collected.github.starsCount
            ? parsedPkg.collected.github.starsCount
            : 'N/A'], ['forks', parsedPkg.collected.github.forksCount
            ? parsedPkg.collected.github.forksCount
            : 'N/A']]



        filteredPkg.vulnerabilities = [parsedPkg.collected.source.vulnerabilities ? parsedPkg.collected.source.vulnerabilities : null];
        filteredPkg.outdatedDependencies = [parsedPkg.collected.source.outdatedDependencies ? Object.keys(parsedPkg.collected.source.outdatedDependencies) : null];

        //change dependencies to complex array of arrays

        //filteredPkg.dependencies = parsedPkg.collected.metadata.dependencies
        //filteredPkg.devDependencies = parsedPkg.collected.metadata.devDependencies
        //filteredPkg.peerDependencies = parsedPkg.collected.metadata.peerDependencies

        // let dependencies = parsedPkg.collected.metadata.dependencies? parsedPkg.collected.metadata.dependencies : [];
        // let devDependencies = parsedPkg.collected.metadata.devDependencies? parsedPkg.collected.metadata.devDependencies : [];
        //let peerDependencies = parsedPkg.collected.metadata.peerDependencies? parsedPkg.collected.metadata.peerDependencies: [];



        let dependencies = []
        if (parsedPkg.collected.metadata.dependencies){
          Object.keys(parsedPkg.collected.metadata.dependencies).forEach((name) => {
            dependencies.push(['dependencies', name]);
          })
        }
        if (parsedPkg.collected.metadata.devDependencies){
        Object.keys(parsedPkg.collected.metadata.devDependencies).forEach((name) => {
            dependencies.push(['devDependencies', name]);
          })
        }
        if (parsedPkg.collected.metadata.peerDependencies){
        Object.keys(parsedPkg.collected.metadata.peerDependencies).forEach((name) => {
            dependencies.push(['peerDependencies', name]);
          })
        }

        filteredPkg.dependencies = dependencies



        // console.log('-----------------------------------------------------')
        // console.log(dependencies)
        // console.log('------------------------------------------------------')



        filteredPkg.status = [['status', parsedPkg.collected.github.statuses
            ? parsedPkg.collected.github.statuses
            : -1 ],['hasTestScript', parsedPkg.collected.metadata.hasTestScript]]

        filteredPkg.scores = [['quality', parsedPkg.score.detail.quality, 0], ['popularity', parsedPkg.score.detail.popularity, 1], ['maintenance', parsedPkg.score.detail.maintenance, 2], ['final', parsedPkg.score.final, 3]];
        filteredPkg.subScores = [['maintenance', parsedPkg.evaluation.maintenance], ['popularity', parsedPkg.evaluation.popularity], ['quality', parsedPkg.evaluation.quality]];


        filteredInfo.push(filteredPkg)

    })


    return JSON.stringify(filteredInfo)
}

//exports.parse =
const temp = function() {
    return new Promise((resolve, reject) => {
        parsePkgJSON().then((packages) => {
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

temp()
// exports.parse = function(){
//   return new Promise(resolve, reject){
//     requestData()
//)
