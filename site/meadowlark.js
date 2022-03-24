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

const app = express()

// app.disable('x-powered-by')
app.engine('handlebars', engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const port = process.env.PORT || 3000

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

app.get('/', (req, res) => {
  console.log('monster', req.cookies.monster)
  console.log('signedMonster', req.signedCookies.signed_monster)
  res.cookie('monster', 'nom nom', {
    httpOnly: true
  })
  res.cookie('signed_monster', 'nom nom', { signed: true })
  res.render('home')
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



// 定制404页
app.use((req, res) => {
  res.status(404)
  res.render('404')
})

// 定制500页
app.use((err, req, next) => {
  console.error(err.message)
  res.status(500)
  res.render('500')
})

app.listen(port, () => console.log(`
express started on http://localhost:${port};press ctrl-c to terminate.
`))