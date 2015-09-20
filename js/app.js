'use strict';
var fs = require('fs')
var express = require('express');
var fs = require('fs');
var app = express();
app.set("views", "./views");
app.set("view engine", "jade");
var clarifai = require('./clarifai_node.js');

// verify that clarify credentials are present
// verify and use clarifai credentials
fs.readFile('assets/clarifaiCredentials.txt', function (err, contents) {
	if (err) throw err;
	var creds = contents.toString().split('\n');
	clarifai.initAPI(creds[0], creds[1]);
});

// Game session variables
var goalTag;

// ~~~~~~~~~~~~~~~~~~~~~~~~ Request handlers ~~~~~~~~~~~~~~~~~~~~~~~~
// Landing page
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get('/select-url', function (req, res) {
    res.render('urlselect', { });
});

app.post('/select-url', function (req, res) {
    res.send('woohii');
});
// Newgame call
app.get('/newgame', function(req, res) {
	/*
	var img = randImage();
	var tag = randTag();
	res.send(img, tag);
	*/
});
// Process pic
app.get('/picselect', function(req, res) {
	/*
	var tags = clarifai(req.pic);
	tags.forEach()
	*/
});

app.get('/test', function(req,res) {
    var url = 'http://i.imgur.com/l35eOVB.jpg'
    clarifai.tagURL( url , url, function(err, clarires) {
        if( err != null ) {
            res.err = true;
        }
        else {
            if( typeof clarires["status_code"] === "string" && 
                    ( clarires["status_code"] === "OK")) {
                res.imgtags = clarires["results"][0].result["tag"]["classes"];
            }           
        }

        if( res.err){
            res.send("ERROR"); 
        }else{
            res.render('index', { title: 'Tags', message: JSON.stringify(res.imgtags) });
        }

    });
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

