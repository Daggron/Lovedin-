const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(email, password, done){
    // Match Username
    //let query = {username:username};
    let query={email:email};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          if(user.isActive && user.State=='active') {
            return done(null, user);
          }
          else{
            return done(null, false, {message: 'Please Verify your mobile number'});
          }
        } else {

          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));


  //serializing and deserializing the users don't touch it i mean never

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};



