const express = require("express");
const router = express.Router();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport= require("passport");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
  }
));

//Google Route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));


// Retrive user data
app.get('/google/callback', 
  passport.authenticate('google', 
  { failureRedirect: '/login',
  successRedirect: "/babycode"
})
);


module.exports = router;