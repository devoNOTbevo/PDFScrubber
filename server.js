//Requires
const http = require('http');
const util = require('util');
const express = require('express');
const path = require('path');
const extract = require('pdf-text-extract')
const fs = require('file-system');
const formidable = require("formidable");

//Instantiate and configure Express
express()
  .get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/form.html'));
    console.log(__dirname)
  })
  .post('/fileupload', (req, res) => receiveFileUpload(req, res))
  .listen(1185, () => console.log('server listening on 1185'));

function displayForm(res) {
  fs.readFile('form.html', (err, data) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': data.length
    });
    res.write(data);
    res.end();
  });
}

//Declare some helper functions
function receiveFileUpload(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    res.write('File uploaded!');
    const oldpath = files.filetoupload.path
    const newpath = path.join(__dirname + '/test.pdf');
    fs.rename(oldpath, newpath, err => {
      if (err) throw err;
      res.write('\nFile moved!');
      extractTextFromPDF(newpath, res);
      res.end();
    });
  });
}

function extractTextFromPDF(path, res) {
  extract(path, (err, pages) => {
    if (err) {
      console.log("error", err);
      return;
    }

    for(var key in pages){
    	var textArr = pages[key].split('\n');
    	for(var i=0; i<textArr.length;i++){
    		if(textArr[i].search('.CABS.')>=0){
          console.log(textArr[i].search('.CABS.')>=0, ">>>>", textArr[i])
           res.write("\n"+textArr[i]);
        }
    	}

    }
  })
}
