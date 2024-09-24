require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const routerListing = require("./router/listing");
const routeruser = require("./router/user");
const { default: mongoose } = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const User = require('./model/user');
const LocalStrategy = require("passport-local");
const wrapAsync = require('./utilities/wrapAsync');
const ExpressError = require('./utilities/ExpressError');

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(()=> {
    console.log("connected to db")
}).catch((err)=> {
    console.log(err);
})

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res)=> {
//     let fakeUser = new User({
//         email: "kush@gmail.com",
//         username: "kush",
//     });
//     let registeredUser = await User.register(fakeUser, "kush");
//     res.send(registeredUser);
// });

app.use("/", routerListing);
app.use("/", routeruser);

app.all("*", (req, res, next)=> {
    next(new ExpressError(404, "Page not Found!"));
})

app.use((err, req, res, next)=> {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
})


app.listen(PORT, ()=> {
    console.log("app is connected to port 8080");
})