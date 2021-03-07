const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

require("dotenv").config();
const app = express();
const path = 3001;
const usersRouter = require("./routes/users");
const User = require("./models/user");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));

// const app = express();
// const path = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin: *");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create({
    //   mongoUrl: process.env.DATABASE_URL,
    //   collectionName: "sessions",
    // }),
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    // },
  })
);
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize());
app.use(passport.session());
require('./passport-config')(passport);

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: "Incorrect username." });
//       }
//       bcrypt.compare(password, user.password, (err, result) => {
//         if (err) throw err;
//         if (result) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       });
//       // return done(null, user);
//     });
//   })
// );
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch(err => done(err));
// });

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use("/users", usersRouter);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post('/logout', (req, res, next) => {
  req.logOut();
  res.send('succesfully logout');
})

app.get("/user", (req, res) => {
  res.send(req.user);
});



app.listen(path, () => {
  console.log(`listening on ${path}`);
});
