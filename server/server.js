'use strict';

const requestData = require('../server/requestData');
const less = require('./less')
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');

module.exports.run = (args) => {
    console.log('Recieving NPM scores...')
    var pkgs = args._;

    if (args.l || args.less == true ){
        requestData.request(pkgs, args.d)
        .then(function (data) {
          less.buildTable(data)
        }).catch(function(e){
          console.log(e)
      })
      return;
    }
    else{
      getJSON(pkgs).then(function(pkgURLs){
        getNPM(pkgURLs, args.d)
      }).catch(function(error){
        //If I want to provide a default package
        console.log(error)
      })
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
    app.get('/', function(req, res) {
        res.sendFile('/index.html', {root: path.join(__dirname, '../client')})
    })

    app.get('*', function(req, res) {
        res.send('A wrong url has been requested, please check spelling')
    })
    listen(args.p)
}

/*
if you are making a request for some arbitrary set of
packages call requestData.format() to wrap in the url
encoding and then pass to getNPM(), the second argument
needs to be the don't show devDependencies flag, args.d
and so has to be defined in the run function
*/

const getJSON = function(pkgs){
  const packageUrls = requestData.parseJSON().then((packages) => {
    return requestData.format(packages.concat(...pkgs))
  })
  return packageUrls;
}

const getNPM = function(pkgs, noDevDep){
    return app.get('/data.json', function(req, res){
      requestData.request(pkgs, noDevDep)
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
}

const listen = function(port){
  return app.listen(port, function() {
    console.log('Launching visiualization on port ' + port)
    opn('http://localhost:' + port + '/');
    })
  }
