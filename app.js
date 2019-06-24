const express = require('express');
const app = express();
const path = require('path');
const index=require('./routes/index');
const mongoose = require('mongoose');
const users = require('./routes/users');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
const bodyParser = require('body-parser');


//The data base url is in the database file present in the config folder
mongoose.connect(config.database,{useNewUrlParser:true});

let db=mongoose.connection;

db.on("error",(err)=>{
    console.log(err);
    console.log("Can't connect to the db");
});

db.once("open",()=>{
    console.log("Db connected Successully");
});


// Express Session Middleware

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));


  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());


  //Express Message Middle Ware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//passport config

require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());





app.get('*',(req,res,next)=>{
  res.locals.users=req.user || null;
  next();
});




app.set('view engine','ejs');
app.use(express.static('./public/'));
 

app.use('/',index);
app.use('/users',users);



let Port = process.env.Port||5000;

app.listen(Port,()=>{
    console.log(`Server Started on port ${Port}`);
});