const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

let port = process.env.PORT || 3000;

passport.use(
  new Strategy(
    {
      clientID: "462916784120715",
      clientSecret: "aab8bfd1df2d883178e8d61dac73ec0d",
      callbackURL:
        "https://fierce-cliffs-71332.herokuapp.com/login/facebook/callback"
    },
    function(accessToken, refereshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

//create express app
var app = express();

//set view dir

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "lco app",
    resave: true,
    saveUninitialized: true
  })
);

//@route  - GET /
//@desc   - a route to home page
//@access - PUBLIC
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user
  });
});

//@route  - GET /login
//@desc   - a route to login
//@access - PUBLIC
app.get("/login", (req, res) => {
  res.render("login");
});

//@route  - GET /login/facebook
//@desc   - a route to facebook auth
//@access - PUBLIC
app.get("/login/facebook", passport.authenticate("facebook"));
app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    //Successfully authenticate , redirect home
    res.redirect("/");
  }
);

//@route  - GET /
//@desc   - a route to profile of user
//@access - PRIVATE
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    re.render("profile", {
      user: req.user
    });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
