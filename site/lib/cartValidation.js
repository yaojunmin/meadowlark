// 导出对象
module.exports = {
  resetValidation(req, res, next) {
    const { cart } = req.session
    if (cart) cart.warnings = cart.errors = []
    next()
  },
  checkWaivers(req, res, next) {
    const { cart } = req.session
    if (!cart) return next()
    if (cart.items.some(item => item.guests > item.product.maxGuests)) {
      cart.errors.push('one or more of your selected tours'
       + 'cannot accommodate the number of guests you have selected.')
    }
    next()
  }
}