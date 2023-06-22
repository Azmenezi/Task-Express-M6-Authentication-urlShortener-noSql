const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username });
      if (!foundUser) return done(null, false);
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordsMatch) return done(null, false);
      done(null, foundUser);
    } catch (error) {
      done(error);
    }
  }
);