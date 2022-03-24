module.exports = (req, res, next) => {
  res.locals.flash = req.session.flash
  next()
}