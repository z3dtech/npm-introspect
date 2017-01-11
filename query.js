const got = require('got');
const fs = require('fs');

got.stream("https:\//api.npms.io/v2/package/react").pipe(fs.createWriteStream('index.html'));

//lets create an idea of what this should all return and look at and then
//write the stream, and build out the first level of the visualization
