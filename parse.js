const fs = require('fs');

var parse = function (){
   return new Promise((resolve, reject) => {
     fs.readFile('./package.json', 'utf-8', (err, data) => {
       if (err) reject(err)
       let contents = JSON.parse(data);//try and catch all the JSON parse, reject(new Error('OH SHiT'))
       let packages = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));

       resolve(packages)
   });
  });
}
module.exports = parse;


//http://stackoverflow.com/questions/25314086/node-js-not-resolving-array-of-requests
