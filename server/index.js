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
    secert: 'monkegetabanana',
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
    res.render('index', {nomen:  req.session.userName});
});

app.get('/monkeflip', function(req, res){
    res.render('monkeflip');
});

app.get('/monkeMusic', function(req, res){
    res.render('monkeMusic');
});

app.post('/welcome', (req, res) => {
    req.session.userName = req.body.visitorname;
    res.redirect('/');
});

