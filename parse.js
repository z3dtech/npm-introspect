const fs = require('fs');
 function parse(cb, err){
    fs.readFile('./package.json', 'utf-8', (err, data) => {
      if (err) cb(null, err);
      let contents = JSON.parse(data);
      let result = Object.keys(contents['dependencies']).concat(Object.keys(contents['devDependencies']));
      console.log(result);
      cb(result)
      return result;
});
}
module.exports = parse;


//http://stackoverflow.com/questions/25314086/node-js-not-resolving-array-of-requests
