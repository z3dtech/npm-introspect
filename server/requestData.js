'use strict'

const fs = require('fs');
const path = require('path')
const Promise = require("bluebird");
const request = require('request-promise');

var parsePkgJSON = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve('package.json'), 'utf-8', (error, data) => {
            if (error)
                reject(error)
            console.log('error in parse' + data)
            let contents = JSON.parse(data); //try and catch all the JSON parse, reject(new Error('OH SHiT'))
            let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
            console.log(packages)
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
    console.log('pkgInfo' + pkgInfo)

    pkgInfo.forEach((pkg) => {
        let parsedPkg = {}
        let filteredPkg = {}

        try {
            parsedPkg = JSON.parse(pkg)
        } catch (error) {
            console.log(error)
        }
        /*
    lets refactor this so that we are using a loop and try/catch and setting to
    0/undefined any thing that isn't very good

    */

        filteredPkg.name = parsedPkg.collected.metadata.name;
        filteredPkg.version = parsedPkg.collected.metadata.version;
        filteredPkg['dependencies'] = parsedPkg.collected.metadata.dependencies;
        filteredPkg['devDependencies'] = parsedPkg.collected.metadata.devDependencies;
        filteredPkg['peerDependencies'] = parsedPkg.collected.metadata.peerDependencies;
        filteredPkg['hasTestScript'] = parsedPkg.collected.metadata.hasTestScript;

        filteredPkg['downloadsAcceleration'] = parsedPkg.collected.npm.downloads;

        filteredPkg['starsCount'] = parsedPkg.collected.github.starsCount
            ? parsedPkg.collected.github.starsCount
            : null;
        filteredPkg['forksCount'] = parsedPkg.collected.github.forksCount
            ? parsedPkg.collected.github.forksCount
            : null;
        filteredPkg['statuses'] = parsedPkg.collected.github.statuses
            ? parsedPkg.collected.github.statuses
            : null;

        filteredPkg['outdatedDependencies'] = parsedPkg.collected.source.outdatedDependencies;
        filteredPkg['vulnerabilities'] = parsedPkg.collected.source.vulnerabilities;
        filteredPkg.maintenance = parsedPkg.score.detail.maintenance;
        filteredPkg.popularity = parsedPkg.score.detail.popularity;
        filteredPkg.quality = parsedPkg.score.detail.quality;
        filteredPkg.final = parsedPkg.score.final;

        filteredPkg['evaluation'] = parsedPkg.evaluation;

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
                    console.log('data logged')
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
