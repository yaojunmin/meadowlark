const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

const db = require('../db')

// 序列化
passport.serializeUser((user, done) => done(null, user._id))

// 反序列化
passport.deserializeUser((id, done) => {
  db.getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
})