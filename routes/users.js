const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require('dotenv');

const router = express.Router();
const User = require("../models/user");
const Token = require("../models/token");

// ---------- get all registered users ----------
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// ---------- get a user ----------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user missing" });
    }
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// ---------- create a user ----------
router.post("/", body("email").isEmail(), async (req, res) => {
  try {
    
    // check for errors during validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // generate hash for the password, create the user and save it
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const newUser = await user.save();

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: "foobar@example.com",
      subject: "Confirm email",
      text: "Hello",
      // html: '<b>Hello World</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // create the token
    // const token = new Token({
    //   userId: newUser._id,
    //   token: crypto.randomBytes(16).toString("hex"),
    // });
    // const newToken = await token.save((err) => {
    //   if (err) {
    //     return res.status(500).send({ msg: err.message });
    //   }

      
    // });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// ---------- update a user ----------
router.patch("/:id", (req, res) => {});

// ---------- delete a user ----------
router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ message: "user deleted" });
  user.remove();
});

module.exports = router;
