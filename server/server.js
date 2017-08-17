'use strict';

const requestData = require('../server/requestData');
const less = require('./less')
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');

module.exports.run = (argv) => {
    console.log('Recieving NPM scores...')
    var pkgs = argv._;

    if (argv.l || argv.less == true ){
      requestData.parse(pkgs)
      .then(function (data) {
        less.buildTable(data)
      }).catch(function(e){
        console.log(e)
      })
      return;
    }

    app.get('/fork.png', function(req, res){
      res.sendFile('/fork.png', {root: path.join( __dirname, '../assets')})
    })
    app.get('/index.js', function(req, res) {
        res.sendFile('/index.js', {root: path.join(__dirname, '../client')})
    })
    app.get('/style.css', function(req, res) {
        res.sendFile('/style.css', {root: path.join(__dirname, '../client')})
    })

    app.get( '/search/:query', function( req, res )  {
      var pkg = req.params.query.split(",");
      requestData.parseSearch(pkg)
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
    });

    app.get('/data.json', function(req, res) {
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
        res.sendFile('/index.html', {root: path.join(__dirname, '../client')})
    })

    app.get( '/:package', function( req, res ) {
      var pkgInput = req.params.package.split(",");

      res.sendFile('/index.html', {root: path.join(__dirname, '../client')})   
    });

    app.get('*', function(req, res) {
        res.send('A wrong url has been requested, please check spelling')
    })

      app.listen(argv.p, function() {
          console.log('Launching visiualization on port ' + argv.p)
          opn('http://localhost:' + argv.p + '/');
          })

}
