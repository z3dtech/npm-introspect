'use strict';

const requestData = require('../server/requestData');
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');

'/style.css', {root: path.join(__dirname, '../client')}
module.exports.run = (argv) => {

    app.get('/fork.png', function(req, res){
      res.sendFile('/fork.png', {root: path.join( __dirname, '../assets')})
    })
    app.get('/index.js', function(req, res) {
        res.sendFile('/index.js', {root: path.join(__dirname, '../client')})
    })
    app.get('/style.css', function(req, res) {
        res.sendFile('/style.css', {root: path.join(__dirname, '../client')})
    })
    app.get('/data.json', function(req, res) {
        console.log('Recieving NPM scores...')

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
        res.sendFile('/index.html', {root: path.join(__dirname, '../client')})
    })

    app.get('*', function(req, res) {
        res.send('A wrong url has been requested, please check spelling')
    })

    app.listen(argv.p, function() {
        console.log('Launching visiualization on port ' + argv.p)
        opn('http://localhost:' + argv.p + '/');

    })

}
