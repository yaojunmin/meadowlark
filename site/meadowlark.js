const express = require('express')
const engine = require('express-handlebars')
const fortune = require('./lib/fortune')
const handlers = require('./lib/handlers')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const multer = require('multer') // 建议采用
const upload = multer({dest: 'uploads/'})
const cookieParser = require('cookie-parser')
const { credentials } = require('./config')
const expressSession = require('express-session')
const flashMiddleware = require('./lib/middleware/flash')
const emailService = require('./lib/email')(credentials)
const morgan = require('morgan')
const fs = require('fs')
const cluster = require('cluster')
const db = require('./db')

const app = express()

// app.disable('x-powered-by')
app.engine('handlebars', engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const port = process.env.PORT || 3000

// 日志
switch(app.get('env')) {
  case 'development':
    app.use(morgan('dev'))
    break;
  case 'production':
    // a 追加
    const stream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a'})
    app.use(morgan('combined', { stream }))
    break;
}

app.use(express.static(__dirname + '/public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,//是否强制保存session信息
  saveUninitialized: false,//是否保存未初始化的session
  secret: credentials.cookieSecret,//对session id进行签名
}))
app.use(flashMiddleware)

// 不同worker处理不同请求日志
app.use((req, res, next) => {
  if(cluster.isWorker) {
    console.log(`worker ${cluster.worker.id} received request`)
  }
  next()
})

app.get('/', (req, res) => {
  console.log('monster', req.cookies.monster)
  console.log('signedMonster', req.signedCookies.signed_monster)
  res.cookie('monster', 'nom nom', {
    httpOnly: true
  })
  res.cookie('signed_monster', 'nom nom', { signed: true })
  res.render('home')
})

// 测试异常
app.get('/fail', (req, res) => {
  throw new Error('nope')
})

app.get('/about', (req, res) => {
  res.render('about', {fortune: fortune.getFortune()})
})

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


// 定制404页
app.use((req, res) => {
  res.status(404)
  res.render('404')
})

// 定制500页
// express能够捕获的异常
app.use((err, req, res, next) => {
  console.error(err.message)
  // 亦可通知提醒错误
  res.status(500).render('500')
})

// 未捕获异常
// 会覆盖默认行为
// sentry记录错误 日后修复异常
process.on('uncaughtException', err => {
  console.error('uncaught exception\n', err.stack)
  // 执行清理工作，例如关闭数据库链接
  process.exit(1)
})



function startServer(port) {
  app.listen(port, () => console.log(`
  express started on ${app.get('env')} mode at 
  http://localhost:${port};
  press ctrl-c to terminate.
  `))
}
// 判断是否直接运行
if (require.main === module) {
  startServer(process.env.PORT || 3000)
} else {
  // require导入为一个模块
  module.exports = startServer
}