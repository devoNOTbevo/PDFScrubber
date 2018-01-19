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