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

module.exports = (app, options) => {
  if (!options.successRedirect) options.successRedirect = '/account'
  if (!options.failureRedirect) options.failureRedirect = '/login'
  return {
    init() {
      const config = options.providers
      // 配置Facebook认证
      passport.use(new FacebookStrategy({
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
      }, (accessToken, refreshToken, profile, done) => {
        const authId = 'facebook:' + profile.id
        db.getUserByAuthId(authId)
          .then(user => {
            if (user) return done(null, user)
            db.addUser({
              authId,
              name: profile.displayName,
              created: new Date(),
              role: 'customer',
            })
              .then(user => done(null, user))
              .catch(err => done(err, null))
          })
          .catch(err => {
            if (err) return done(err, null)
          })
      }))
      // 初始化passport
      app.use(passport.initialize())
      // 存储session信息
      app.use(passport.session)
    },
    registerRoutes() {
      app.get('/auth/facebook', (req, res, next) => {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect
        // 认证Facebook 重定向到Facebook认证界面
        passport.authenticate('facebook')(req, res, next)
      })
      // 重定向回来 带有令牌相关参数 passport进行验证
      app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: options.failureRedirect
      }), (req, res) => {
        const redirect = req.session.authRedirect
        if (redirect) delete req.session.authRedirect
        res.redirect(303, redirect || options.successRedirect)
      })
    },
  }
}