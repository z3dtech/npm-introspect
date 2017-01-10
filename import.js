var request = require("request");

var fs = require("fs");
var cheerio = require("cheerio");


function getdeps(modul, cb){
  function mod (name, href){
    this.name =name;
    this.href = href;
  }


  var modurl = 'https://www.npmjs.com/package/' + modul;

  var dependencies = []
  request(modurl, function(err, res, html){
    if(!err){
        //  console.log(html);
          var $ = cheerio.load(html)
          var lin = $(".list-of-links");
          for ( o in lin){
             var p = o;
          }
        //  console.log(lin["1"]["children"][1].next)
          for(p of lin["1"]["children"]){
           //   console.log(p)
              var link = p.attribs;
              if(link){
                dependencies.push(new mod(p.children[0].data, link.href))
            //  console.log(p.children[0].data);
              //console.log(p.attribs);
          }}
      //    console.log(dependencies)
          cb(dependencies)
      }

  })

}

module.exports = getdeps;
