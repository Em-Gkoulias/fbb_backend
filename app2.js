const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

require("dotenv").config();
const app = express();
const path = 3001;
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const User = require('./models/user');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passport-config")(passport);

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

app.use("/static", express.static("./uploads"));
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        // console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
  req.logOut();
  res.send("succesfully logout");
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.post("/findUser", async (req, res) => {
  // const user = User.find()
  console.log(req.body);
})

app.listen(path, () => {
  console.log(`listening on ${path}`);
});