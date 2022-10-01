const fs = require("fs")

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

const app = express();

app.set('views', './templates');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

const port = 9000;
let reviews = [];


var privateKEY  = fs.readFileSync('./private.ec.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.pem', 'utf8');
//remove session
//dac cookie dopiero jak kliknac w valid session


app.get('/', function (req, res) {
	res.render('index', {
    reviews
  });
});
//auth token jwt jesli git to wstaw recke
app.post('/reviews', checkToken, function (req, res) {
  //if auth good push review
  
  reviews.push(req.body.newReview);
  //decode wez username
	res.render('index', {
    //isValidSession: req.session.isValid,

    //username z tokena
    username: 'Alice',
    reviews
  });
});
//tutaj zwroc cookie z jwt
app.get('/session/new', function (req, res) {
  const token = jwt.sign({user:'Alice'},'secret_key')
  //save token in cookie
  res.cookie('authcookie',token,{maxAge:900000,httpOnly:true}) 
  res.redirect('/');
});

function checkToken(req, res, next){
  //get authcookie from request
  const authcookie = req.cookies.authcookie
  
  //verify token which is in cookie value
  jwt.verify(authcookie,"secret_key",(err,data)=>{
   if(err){
     res.sendStatus(403)
   } 
   else if(data.user){
    req.user = data.user
    next()
  }
  })
}


app.get('/user', function (req, res) {
  if (req.session.isValid) {
    res.render('user', {
      username: req.session.username,
      email: req.session.email
    });
  } else {
    res.redirect('/');
  }
});

app.post('/user', function (req, res) {
  if (req.session.isValid) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    res.redirect('/user');
  } else {
    res.redirect('/');
  }
});


app.listen(port, () => console.log(`The server is listening at http://localhost:${port}`));
