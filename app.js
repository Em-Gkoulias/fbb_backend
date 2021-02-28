const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// connect to mongodb
const dbURI =
  "mongodb+srv://fbb-admin:tally-ho_313@fbbcluster.yimvc.mongodb.net/fbb?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conected to database"));

// middlewares
app.use(cors());
app.use(express.json());

// routes
const usersRouter = require("./routes/users");
app.use('/users', usersRouter);

app.listen(3001, () => {
  console.log("listening on 3001");
});
