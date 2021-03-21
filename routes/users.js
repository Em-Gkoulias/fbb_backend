const express = require("express");
const bcrypt = require('bcryptjs');

const router = express.Router();
const User = require("../models/user");

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
    console.log(error)
  }
});

// ---------- create a user ----------
router.post("/", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const newUser = await user.save();
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
