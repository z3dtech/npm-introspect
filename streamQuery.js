const request = require('request');
const async = require('async')
const fs = require('fs');

var destination = fs.createWriteStream('data.json')

request
  .get('https://api.npms.io/v2/package/react')
  .on('error', function(err){
    console.log(err);
  })
  .on('response', function(response){
    console.log(response.statusCode);
    console.log(response.headers['content-type']);
    })
  .pipe(destination);

  async.forEachLimit items, 5, ((item, next) ->
    request item.url, (error, response, body) ->
      console.log body
      next error)
      , (err) ->
          throw err  if err
          console.log "All requests processed!"
  But I want to use it with streams, like this:

  async.forEachLimit items, 5, ((item, next)->
      stream = fs.createWriteStream file
      request.get(item.url).pipe(stream))
      , (err)->
            throw err  if err
            console.log "All requests processed!"


            You'll need to bind to the Readable Stream's 'end' event separate from the .pipe().

res = request.get(item.url)
res.pipe(stream)
res.on 'end', next
This also lets you bind to its 'error' event:

res.on 'error', next
But, you could also listen to the Writable Stream's 'finish' event:

request.get(item.url)
    .on 'finish', next

//.map
//var urls = ["https://api.npms.io/v2/package/d3"]//, "https://api.npms.io/v2/package/react", "https://api.npms.io/v2/package/bluebird"];
