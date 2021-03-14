const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');


const clientPath = path.join(__dirname, '../client/')
const staticPath = path.join(clientPath,'/static/');
const viewsPath = path.join(clientPath,'/views/')

const app = express();
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    name: 'monke',
    secret: 'monkegetabanana',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*60*24*3,
    }
}));
app.listen(2000);

app.set('view engine','ejs');
app.set('views',viewsPath);

//this takes functions and response

app.get('/', function(req, res){
    res.render('index', {data:  req.session});
});

app.get('/monkeflip', function(req, res){
    res.render('monkeflip', {data:  req.session});
});

app.get('/monkeMusic', function(req, res){
    res.render('monkeMusic', {data:  req.session});
});

app.post('/welcome', (req, res) => {
    console.log(req.body);
    req.session.username = req.body.nombre;
    res.send('SUCCESS');
});

