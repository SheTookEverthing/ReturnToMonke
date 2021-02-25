const express = require('express');
const ejs = require('ejs');
const path = require('path');

const clinetPath = path.join(__dirname, '../client');
const staticPath = path.join(clientPath,'/static');
const viewPath = path.join(client.Path,'/views');

const app = express();

app.set('view engine','ejs');
app.set('view',viewPath);

//this takes functions and response
app.get('/', function(req, res){
    res.render('index');
});

app.get('/monkeflip', function(req, res){
    res.render('monkeflip');
});

app.get('/monketypebeat', function(req, res){
    res.render('monkeMusic');
});

app.use(express.static(staticPath));

app.listen(2000);
