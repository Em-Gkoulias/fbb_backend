if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
// const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const usersRouter = require("./routes/users");


// ---------- connect to database ----------
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));


// ---------- middlewares ----------
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use("/users", usersRouter);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin: *");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passport-config")(passport);


// ---------- routes ----------
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send('User does not exist')
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Successfully Authenticated')
      })
    }
  })(req, res, next)
});

// ---------- not sure if i 'm going to use it ----------
app.post("/register", (req, res) => {
  // console.log(req.body);
});

app.get('/user', (req, res) => {
  console.log(req.user);
  res.send(req.user);
})


// ---------- server listening ----------
app.listen(3001, () => {
  console.log("listening on 3001");
});
