const express = require('express');
const ejs = require('ejs');
const path = require('path');

const clientPath = path.join(__dirname, '../client/')
const staticPath = path.join(clientPath,'/static/');
const viewsPath = path.join(clientPath,'/views/')

const app = express();

app.set('view engine','ejs');
app.set('views',viewsPath);

var x = 0;

const counter = function(req,res,next){
    x++;
    console.log(x);
    next();
}

app.use(counter);
app.use(express.static(staticPath));

//this takes functions and response
app.get('/', function(req, res){
    res.render('index');
});

app.get('/monkeflip', counter, function(req, res){
    res.render('monkeflip');
});

app.get('/monkeMusic', counter, function(req, res){
    res.render('monkeMusic');
});



app.listen(2000);
