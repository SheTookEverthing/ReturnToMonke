const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const { BlogPost, User } = require('./models.js');
const bcrypt = require('bcrypt')

const clientPath = path.join(__dirname, '../client/')
const staticPath = path.join(clientPath, '/static/');
const viewsPath = path.join(clientPath, '/views/')

const app = express();
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    name: 'monke',
    secret: 'monkegetabanana',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3,
    }
}));


mongoose.connect('mongodb://localhost:27017/monkememes', { useNewUrlParser: true });

app.listen(2000);

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
})

//this takes functions and response

app.get('/', function (req, res) {
    res.render('index', { data: req.session });
});

app.get('/monkeflip', function (req, res) {
    res.render('monkeflip', { data: req.session });
});

app.get('/monkeMusic', function (req, res) {
    res.render('monkeMusic', { data: req.session });
});

app.get('/register', (req, res) => {
    res.render('register', { data: req.session });
});

app.get('/login', (req, res) => {
    res.render('login', { data: req.session });
});

app.post('/register', async (req, res) => {
    try {
        let rawpass = req.body.password;
        var hashedpass = await bcrypt.hash(rawpass, 4);
        var user = new User(req.body);
        user.password = hashedpass;
        await user.save();
        res.redirect('/login');
    }
    catch (e) {
        console.log(req.body)
        res.send("Unable to register!")
    }

})
const authenticated = function(req, res, next) {
    if(req.session.authenticated) next();
    else res.redirect('/login');
}
const funkymonkey = function(req, res, next){
    if(req.session.isFunkyMonke) next();
    else res.send("AAAAK AAAAK AAAH AAAH AAHHH")
}

app.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, async (error, result) => {
        if (error) {
            console.log(error);
            res.send("User not found");
        }
        else if (!result) res.send("User not found.");
        else {
            try {
                let match = await bcrypt.compare(req.body.password, result.password);
                if(match){
                req.session.username = result.username;
                req.session.authenticated = true;
                req.session.isFunkyMonke = result.isFunkyMonke;
                res.redirect('/blog/');
                }
                else{
                    reset.send('Incorrect password');
                }
            }
            catch (e) {
                console.log(e)
                res.send('Error')
            }
        }
    })
})

app.post('/blog/:id/comment', authenticated, (req, res) => {
    BlogPost.findById(req.params.id, (error, result) => {
        if(error){
            console.log(error);
            res.send('Error');
        }
        else if(!result){
            res.redirect('/blog/');
        }
        else{
            result.comments.push({author: req.session.username, text: req.body.comment});
            result.save();
            res.redirect(path.join('/blog/', req.params.id + '/'));
        }
    })
});
app.post('/blog/:id/deletecomment/:comment', funkymonkey, async (req, res) => {
    BlogPost.findById(req.params.id, (error, result)=>{
        if(error){
            console.log(error)
            res.redirect('/')
        }
        else if(!result){
            res.send("Enlightment is a funny thing. How you manage to see what doesn't exist?")
        }
        else{
            result.comments.id(req.params.comment).remove();
            result.save();
            res.redirect('/blog/'+req.params.id+'/');
        }
    })
});

app.get('/blog/', async (req, res) => {
    var posts = await BlogPost.find({}, (error, result) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        }
        console.log(result);
        res.render('blog', { data: req.session, postset: result });
    });
});

app.get('/blog/write/', authenticated, funkymonkey, (req, res) => {
    res.render('writing', { data: req.session, draft: {} });
});

app.get('/blog/:id', (req, res) => {
    var searchID = req.params.id;
    BlogPost.findById(searchID, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/blog/');
        }
        else if (!result) {
            res.status(404);
        }
        else {
            console.log(result);
            let parsedText = result.body.replace(/\r\n|\r|\n/g, "<br />");
            result.parsedText = parsedText;
            res.render('entry', { data: req.session, entry: result });
        }
    });
});

app.post('/blog/writepost', authenticated, funkymonkey, async (req, res) => {
    console.log(req.body);
    //handle duplication//
    try {
        let newPost = new BlogPost(req.body);
        newPost.author = req.session.username;
        await newPost.save();
        res.redirect('/blog/');
    }
    catch (e) {
        res.redirect('/blog/write/');
    }
});

app.post('/welcome', (req, res) => {
    req.session.username = req.body.nombre;
    res.send('SUCCESS');
});

app.get('/blog/:id/edit', funkymonkey,(req, res) => {
    BlogPost.findById(req.params.id, (error, result) => {
        if (error) res.redirect('/blog/');
        else if (!result) res.redirect('/blog/');
        else res.render('writing', { data: req.session, draft: result });
    });
});

app.post('/blog/:id/edit', funkymonkey, (req, res) => {
    BlogPost.findById(req.params.id, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500);
        }
        else if (result) {
            result.title = req.body.title;
            result.body = req.body.body;
            result.save();
            res.redirect('/blog/')
            ///res.redirect(('/blog/', req.params.id));
        }
        else res.redirect('/blog/');
    });
});


app.get('/blog/:id/delete', funkymonkey, (req, res) => {
    BlogPost.deleteOne({ _id: req.params.id }, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/blog/');
    });
});