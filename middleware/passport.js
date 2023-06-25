require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
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

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (tokenPayload, done) => {
    try {
      if (Date.now > tokenPayload.exp * 1000) {
        return done(null, false);
      }

      const user = await User.findById(tokenPayload._id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
