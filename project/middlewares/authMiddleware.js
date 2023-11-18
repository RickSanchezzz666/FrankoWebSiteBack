const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Users } = require('../models/usersModel');
require('dotenv').config();

const options = {
 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
 secretOrKey: process.env.JWT_KEY,
 passReqToCallback: true,
};

module.exports = (app) => {
 app.use(passport.initialize());

 passport.use(
  new JwtStrategy(options, async (req, payload, done) => {
   const {_id} = payload;
   try {
    const user = await Users.findById(_id);
    if (!user) {
     return done(null, false);
    }
    req.user = user;
    return done(null, user);
   } catch (err) {
    console.error(err);
    return done(err);
   }
  })
 );
};