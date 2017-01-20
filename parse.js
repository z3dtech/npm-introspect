const fs = require('fs');

var parse = function (){
   return new Promise((resolve, reject) => {
     fs.readFile('./package.json', 'utf-8', (err, data) => {

       let contents = JSON.parse(data);
       let result = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));

       resolve(result)
        reject(new Error('OH SHiT'))
   });
  });
}
module.exports = parse;


//http://stackoverflow.com/questions/25314086/node-js-not-resolving-array-of-requests
