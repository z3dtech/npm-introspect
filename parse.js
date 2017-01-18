//Without any flags it sould parse the packag.json of the current directory
//Then it should parse arguments for certian flags

//module.exports = parse.js;
const fs = require('fs');
 function parse(){


fs.readFile('./package.json', 'utf-8', (err, data) => {
  if (err) throw err;
  let contents = JSON.parse(data);
  //console.log(Object.keys(contents['dependencies']) + Object.keys(contents['devDependencies']))
  let result = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']))
  return result;

});
}
module.exports = parse;


//http://stackoverflow.com/questions/25314086/node-js-not-resolving-array-of-requests
