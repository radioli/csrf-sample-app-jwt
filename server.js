const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

let reviews = [];

app.set('views', './templates');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(session({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.render('index', {isValidSession: req.session.isValid, username: req.session.username, reviews});
});

app.get('/reviews', function (req, res) {
  if (req.session.isValid && req.query.newReview) reviews.push(req.query.newReview);

	res.render('index', {isValidSession: req.session.isValid, username: req.session.username, reviews});
});

app.get('/session/new', function (req, res) {
  const usernames = ['Bob', 'Alice', 'Charlie', 'Eve'];

  req.session.isValid = true;
  req.session.username = usernames[Math.floor(Math.random()*usernames.length)];
  req.session.email = `${req.session.username}@acme.com`;
  res.end();
});

app.get('/user', function (req, res) {
  if (req.session.isValid) {
    res.render('user', {username: req.session.username, email: req.session.email});
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

