const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;
// const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
// const session = require("express-session");
// const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));

app.use(cors());
app.use((req, res, next) => {
  res.header(("Access-Control-Allow-Origin: *"));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
// app.use(cors());

// middlewares
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "secretcode",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

// app.use(cookieParser("secretecode"))

app.use(express.json());

// routes
const usersRouter = require("./routes/users");
// const session = require("passport");
app.use("/users", usersRouter);

app.post('/login', (req, res) => {
  // console.log(req.body)
})

app.post("/register", (req, res) => {
  // console.log(req.body);
});

app.listen(3001, () => {
  console.log("listening on 3001")
});
