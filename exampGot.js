const got = require('got')
const fs = require('fs')


// Search Query
//got.stream("https://api.npms.io/v2/search?q=react-native").pipe(fs.createWriteStream('asearchQuery.json'));

//Fetch Suggestions
//got.stream("https://api.npms.io/v2/search/suggestions?q=react-native").pipe(fs.createWriteStream('afetchSuggestions.json'));

//Get Package Info
//got.stream("https://api.npms.io/v2/package/react-native").pipe(fs.createWriteStream('agetPackageInfo.json'));

//Get various package info
//fs.createReadStream('apackageInfo.json').pipe(got.stream.post("https://api.npms.io/v2/package/react-native"));

//setTimeout(() => got.stream("https://api.npms.io/v2/search?q=react-native").pipe(fs.createWriteStream('searchQuery.json')), 400)
//figure out more about post request
