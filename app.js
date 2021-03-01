const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// connect to mongodb
// const dbURI =
//   "mongodb+srv://fbb-admin:tally-ho_313@fbbcluster.yimvc.mongodb.net/fbb?retryWrites=true&w=majority";
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true
  })
);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretecode"))

app.use(express.json());

// routes
const usersRouter = require("./routes/users");
// const session = require("passport");
app.use("/users", usersRouter);

app.post('/login', (req, res) => {
  console.log(req.body)
})

app.post("/register", (req, res) => {
  console.log(req.body);
});

app.listen(3001, () => {
  console.log("listening on 3001");
});
