
//mci.js / user

var _               = require('underscore'),
    passport        = require('passport'),
    googleStrategy  = require('passport-google').Strategy;
   
module.exports = {
  
  googleStrategy: function() {
    return new googleStrategy({
      returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:4000/auth/google/return",
      realm: process.env.GOOGLE_REALM || "http://localhost:4000/",
      stateless: true
    },
    function(identifier, profile, done) {
   
      if(profile.emails[0].value === "shane.eckel@brandingbrand.com"){  
      
        user = {
          username: profile.name.givenName || 'Admin',
          email: profile.emails[0].value
        };

        done(null, user);

      }else{
        done(null, false, { 
          message: "I'm sorry but " + profile.emails[0].value + " isn't on the list." 
        });
      }
    });
  },

  serializeUser: function(user, done) {
    done(null, user);
  },

  deserializeUser: function(user, done) {
    done(null, user);
  }
};