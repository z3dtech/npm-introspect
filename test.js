const fs = require('fs')

let a = JSON.parse(fs.readFileSync('/home/nohmapp/code/javascript/npm-introspect/temp1.json'))
let b = JSON.parse(fs.readFileSync('/home/nohmapp/code/javascript/npm-introspect/temp.json'))


console.log(a.collected.metadata.name) //[0].collected.name)
console.log(b[0].package);
