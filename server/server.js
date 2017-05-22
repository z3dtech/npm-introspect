#!/usr/bin/env node

'use strict';

//const requestData = require('../server/requestData')
const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')

module.exports.go = (temp) => {

    //app.set('views', path.join(__dirname, 'v'));

    //app.use(morgan('combined'))

    //app.use(express.static('../client/index.html'))
    app.get('/fork.png', function(req, res){
      res.sendFile('/home/nicholas/code/javascipt/npm-landscape/assets/fork.png')
    })
    app.get('/index.js', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/client/index.js')
    })
    app.get('/style.css', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/client/style.css')
    })
    app.get('/data.json', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/client/data.json')
    })
    app.get('/data1.json', function(req, res) {
        res.sendFile('/home/nicholas/code/javascipt/npm-landscape/data1.json')
    })

    app.get('/datam.json', function(req, res) {
        console.log('servingDatam')

        const userURL = temp._.slice(1)     //the user passed modules
        //sanatize userURL- look for bad characters maybe change underscore to dash ??

          requestData.parse(userURL)
          .then(function (data) {
              res.json(data)
              res.setHeader('Content-Type', 'application/json');
              console.log('Data' + data)
              //res.render(path.join(__dirname + '/../client/index.html'))
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
        console.log(indexPath)
        res.sendFile(indexPath)
    })

    app.get('*', function(req, res) {
        res.send('Something unaccounted for')
    })

    app.listen(8080, function() {


        console.log('Example app listening on port 8080!')

    })

}
