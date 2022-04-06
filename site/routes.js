const main = require('./handles/main')
const handlers = require('./lib/handlers')
const multer = require('multer') // 建议采用
const upload = multer({dest: 'uploads/'})
const { credentials } = require('./config')
const emailService = require('./lib/email')(credentials)


module.exports = app => {
  app.get('/', main.home)
  
  // 测试异常
  app.get('/fail', (req, res) => {
    throw new Error('nope')
  })
  
  app.get('/about', main.about)
  
  app.get('/header', (req, res) => {
    res.type('text/plain')
    const header = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
    res.send(header.join('\n'))
  })
  
  /**表单 浏览器 */
  app.get('/newsletter-signup', handlers.newsletterSignup)
  app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
  app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
  /**表单 fetch */
  app.get('/newsletter', handlers.newsletter)
  app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
  
  /**文件上传 浏览器*/
  app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
  app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).send({ error: err.message })
      handlers.vacationPhotoContestProcess(req, res, fields, files)
    })
  })
  app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestThankYou)
  /**文件上传 fetch*/
  app.get('/contest/vacation', handlers.vacation)
  // app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  //   const form = new multiparty.Form()
  //   form.parse(req, (err, fields, files) => {
  //     if (err) return res.status(500).send({ error: err.message })
  //     handlers.api.vacationPhotoContest(req, res, fields, files)
  //   })
  // })
  app.post('/api/vacation-photo-contest/:year/:month', upload.single('photo'), (req, res) => {
    const fields = req.body
    const files = req.file
    handlers.api.vacationPhotoContest(req, res, fields, files)
  })
  
  // 邮件
  app.post('/cart/checkout', (req, res, next) => {
    // const cart = req.session.cart
    // if(!cart) next(new Error('cart does not exist.'))
    // const name = req.body.name || '',
    //       email = req.body.email || ''
    // if (!email.match(VALID_EMAIL_REGEX)) return res.next(new Error('invalid email address.'))
    // cart.number = Math.random().toString().replace(/^0\.0*/, '')
    // cart.billing = {
    //   name,
    //   email,
    // }
    // render 使用回调 即不会发送到浏览器
    const cart = {
      number: 9999,
      billing: {
        name: req.body.name,
        email: req.body.email,
      },
    }
    res.render('email/cart-thank-you', { layout: null, cart }, (err, html) => {
      console.log('rendered email:', html)
      if(err) console.log('error in email template')
      emailService.send(
        // cart.billing.email,
        req.body.email,
        '我是主题',
        html,
        __dirname + '/public/img/email/email.png'
      )
      .then(info => {
        console.log('send!', info)
        res.render('cart-thank-you', { cart })
      })
      .catch(err => {
        console.error('unable to send confirmation: ' + err.message)
      })
    })
  })
  
  app.get('/vacations', handlers.listVacations)
  
  app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm)
  app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess)
  
  app.get('/set-currency/:currency', handlers.setCurrency)

  app.get('/api/vacations', handlers.api.getVacationsApi)
  app.get('/api/vacation/:sku', handlers.api.getVacationBySkuApi)
  app.post('/api/vacation/:sku/notify-when-in-season', handlers.api.addVacationInSeasonListenerApi)
  app.delete('/api/vacation/:sku', handlers.api.requestDeleteVacationApi)
}