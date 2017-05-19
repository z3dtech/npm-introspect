const fs = require('fs');
const path = require('path')

//import some shit from command line

const parsePkgJSON = () => {
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

//a function that recieves args from the cmd line
module.exports.parseURLs = (userPkgs) => {
  //sanatize userURL- look for bad characters maybe change underscore to dash ??
  //
  return new Promise((resolve, reject) => {
    parsePkgJSON().then((packages) => {
      packages.push(...userPkgs)
      const packageUrls = packages.map((name) => {
          return "https://api.npms.io/v2/package/" + name
        })
      resolve(packageUrls)
      }).catch(function(error) {
          reject('There is something wrong with parsing the packages' + error)
      })
    })
}
