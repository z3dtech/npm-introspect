'use strict';

const requestData = require('../server/requestData');
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');


module.exports.run = (argv) => {

    app.get('/fork.png', function(req, res){
      res.sendFile('/home/nicholas/code/javascipt/npm-landscape/assets/fork.png')
    })
    app.get('/index.js', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/client/index.js')
    })
    app.get('/style.css', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/client/style.css')
    })
    app.get('/datam.json', function(req, res) {
        console.log('Recieving API results...')

        const pkgs = argv._;
        requestData.parse(pkgs)
        .then(function (data) {
            res.json(data)
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
          })
          .catch(function (e) {
              res.status(500, {
                  error: e
              });
        })
    })

    app.get('/', function(req, res) {
        const indexPath = '/home/nicholas/code/javascipt/npm-landscape/client/index.html'
        //console.log(indexPath) //this will probably break on publish
        res.sendFile(indexPath)
    })

    app.get('*', function(req, res) {
        res.send('Something unaccounted for')
    })

    app.listen(argv.p, function() {
        console.log('Launching visiualization on port ' + argv.p)
        opn('http://localhost:' + argv.p + '/');

    })

}
