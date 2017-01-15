const got = require('got');
const http = require('http');
const fs = require('fs');
const async = require('async')

//search suggestions
//I really like the warning lfags that this gives, think I'll have to check both
//got.stream("https:\//api.npms.io/v2/search/suggestions?q=react + d3").pipe(fs.createWriteStream('data.json'));

//search
//got.stream("https:\//api.npms.io/v2/search?q=react + d3").pipe(fs.createWriteStream('data.json'));

//package get, allows me to retrieve a specific package, I would use search
//if I could always retrieve the right module
//got.stream("https://api.npms.io/v2/package/d3").pipe(fs.createWriteStream('data.json'));

package = ['d3', 'react', 'optomist']



got.stream("https://api.npms.io/v2/package/d3")
  .on('response', function(res){
    console.log(res)
  }).on('end', ()=> {console.log('this has ended')})


// got('https:\//api.npms.io/v2/package/' + package[i])
//     .then(response => {
//         console.log(response.body);
//         body+= response.body.toString();
//         //=> '<!doctype html> ...'
//     })
//     .catch(error => {
//         console.log(error.response.body);
//         //=> 'Internal server error ...'
//     });
//

//got.stream("https://api.npms.io/v2/package/" + package[i]).pipe(fs.createWriteStream('data.json'));



//got.stream("https://api.npms.io/v2/package/" + package[0]).pipe(fs.createWriteStream('data1.json'));


//lets create an idea of what this should all return and look at and then
//write the stream, and build out the first level of the visualization so
//that it can take multiple arguments for libraries, later, we'll add a bit to
//parse package.json as well as filter the data in stream before write


//When the time comes use htis to add a CLI element https://github.com/yargs/yargs

/*


    let promises = [];
promises.push(promise1);
promises.push(promise2);
promises.push(promise3);

function doNext(){
  if(!promises.length) return;
  promises.shift().then((resolved) =>{
    if(resolved.property === something){
      ...
      doNext();
    }else{
      let file = fs.createWriteStream('./hello.pdf');
      let stream = resolved.pipe(file);
      stream.on('finish', () =>{
        ...
        doNext();
      });
    }

  })
}
doNext();
or break up the handler to a controller and Promisified handler:

function streamOrNot(obj){
  return new Promise(resolve, reject){
    if(obj.property === something){
      resolve();
      return;
    }
    let filetodomvc.com
      resolve();
    });
  }
}

function doNext(){
  if(!promises.length) return;
  return promises.shift().then(streamOrNot).then(doNext);
}

doNext()

*/
