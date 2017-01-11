const got = require('got');
const fs = require('fs');

//search suggestions
//I really like the warning lfags that this gives
//got.stream("https:\//api.npms.io/v2/search/suggestions?q=react + d3").pipe(fs.createWriteStream('data.json'));

//search
//got.stream("https:\//api.npms.io/v2/search?q=react + d3").pipe(fs.createWriteStream('data.json'));

//package get, allows me to retrieve a specific package, I would use search
//if I could always retrieve the right module
got.stream("https:\//api.npms.io/v2/package/optimist").pipe(fs.createWriteStream('data.json'));

//lets create an idea of what this should all return and look at and then
//write the stream, and build out the first level of the visualization


//When the time comes use htis to add a CLI element https://github.com/yargs/yargs
