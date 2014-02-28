
//mci.js / user

var _               = require('underscore'),
    passport        = require('passport'),
    googleStrategy  = require('passport-google').Strategy;
   
module.exports = {
  
  googleStrategy: function(ipaddress, port) {

    var baseUrl     = "http://nomorerack-shaneckel.rhcloud.com/" ,
    //var baseUrl     = "http://" + ipaddress + ":" + port + "/" ,
        authReturn  = baseUrl + "auth/google/return";

    return new googleStrategy({
      returnURL: process.env.GOOGLE_RETURN_URL || authReturn,
      realm: process.env.GOOGLE_REALM || baseUrl,
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