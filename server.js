<<<<<<< HEAD
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
=======
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var express = require('express');
var app = express();
var path = require('path');
var extract = require('pdf-text-extract')

app.get('/', function( req, res, next){
	res.sendFile(path.join(__dirname + '/form.html'));
	console.log(__dirname)
});

app.post('/fileupload', function(req, res){
	receiveFileUpload(req,res);
})

function displayForm(res){
	fs.readFile('form.html', function(err,data){
		res.writeHead(200,{
			'Content-Type': 'text/html',
				'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
}

function receiveFileUpload(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        // res.writeHead(200, {
        //     'content-type': 'text/plain'
        // });
        // res.write('received the data:\n\n');
        // res.end(util.inspect({
        //     fields: fields,
        //     files: files
        // }));
        res.write('File uploaded');
        var oldpath = files.filetoupload.path
     	var newpath = path.join(__dirname + '/test.pdf' );
     	fs.rename(oldpath, newpath, function (err) {
        	if (err) throw err;
        	res.write('File uploaded and moved!');
        	res.end();
        	extractTextFromPDF(newpath);
      });
    });
}

function extractTextFromPDF(path){
	extract(path, function (err, pages) {
	  if (err) {
	    console.dir(err)
	    return
	  }
	  for(var key in pages){
	  	var textArr = pages[key].split('\r\n');
	  	for(var i=0; i<textArr.length;i++){
	  		if(textArr[i].search('.CABS.')>=0) console.log(textArr[i]);
	  	}
	  	
	  }
})
}

// function processFormFieldsIndividual(req, res) {
//     //Store the data from the fields in your data store.
//     //The data store could be a file or database or any other store based
//     //on your application.
//     var fields = [];
//     var form = new formidable.IncomingForm();
//     form.on('field', function (field, value) {
//         console.log(field);
//         console.log(value);
//         fields[field] = value + "manipulating the data";
//     });

//     form.on('end', function () {
//         res.writeHead(200, {
//             'content-type': 'text/plain'
//         });
//         res.write('received the data:\n\n');
//         res.end(util.inspect({
//             fields: fields
//         }));
//     });
//     form.parse(req);
// }

app.listen(1185);
console.log('server listening on 1185');
>>>>>>> 0177a43dca61c58bd392c9e3e1b1ba9abfa0135f
