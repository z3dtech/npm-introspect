const request = require('request');
const fs = require('fs');



request
  .get('https://api.npms.io/v2/package/react')
  .on('error', function(err){
    console.log(err)
  })
  .on('response', function(response){
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
    })
  .pipe(fs.createWriteStream('data.json'));
