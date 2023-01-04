const express = require('express');
const app = express()
const passport = require('passport');
const flash = require('connect-flash');

// for delete or put method
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public/'));

require('dotenv').config()
// process.env.

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var routes = express.Router();

app.use(require('express-session')({ 
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true 
}));

require('./util/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
require('./routes')(routes, passport);

app.use(routes);

var moment = require('moment');
moment.locale('en');
var shortDateFormat = "ddd @ h:mmA"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;

module.exports = {app};