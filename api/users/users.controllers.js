const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const createToken = (user) => {
  const payload = {
    username: user.username,
    _id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXP,
  });
  return token;
};

exports.signin = async (req, res) => {
  try {
    const token = createToken(req.user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

const hashedPasswrod = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

exports.signup = async (req, res) => {
  try {
    req.body.password = await hashedPasswrod(req.body.password);
    const newUser = await User.create(req.body);
    const token = createToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
