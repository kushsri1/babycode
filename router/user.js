const express = require("express");
const User = require("../model/user");
const passport = require("passport");
const wrapAsync = require("../utilities/wrapAsync");
const router = express.Router();

router.get("/signup", (req, res)=> {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res)=> {
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=> {
        res.redirect("/babycode");
    })
}))

router.get("/login", (req, res)=> {
    res.render("users/login.ejs");
});

router.post("/login", (passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) ,wrapAsync(async(req, res)=> {
    res.redirect("/babycode");
})));

router.get("/logout", (req, res)=> {
    req.logout((err)=> {
        res.send(err);
    });
    res.redirect("/babycode");
})

module.exports = router;