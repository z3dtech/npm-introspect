#!/usr/bin/env node

'use strict';

const requestData = require('../server/requestData')
const express = require('express')
const app = express()

module.exports.go = () => {


  app.get('/', function (req, res) {
      requestData.go()
      .then(function (data) {
          res.setHeader('Content-Type', 'text/plain');
          res.end(data);
      })
      .catch(function (e) {
          res.status(500, {
              error: e
          });
      });
  });





  app.listen(8080, function () {
    console.log('Example app listening on port 8080!')

  })




}
