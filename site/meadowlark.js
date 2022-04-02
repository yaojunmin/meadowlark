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
const redis = require('redis')
const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)
const flashMiddleware = require('./lib/middleware/flash')
const emailService = require('./lib/email')(credentials)
const morgan = require('morgan')
const fs = require('fs')
const cluster = require('cluster')
const db = require('./db')//创建数据库链接
const addRoutes = require('./routes')

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

// redis@v4
// 创建Redis连接
const redisCache = redis.createClient({
  url: credentials.redis.url,
  legacyMode: true,//保持兼容性
});
redisCache.connect().catch(console.error)
app.use(expressSession({
  resave: false,//是否强制保存session信息
  saveUninitialized: false,//是否保存未初始化的session
  secret: credentials.cookieSecret,//对session id进行签名
  store: new RedisStore({
    client: redisCache,
    logErrors: true,
  })
}))
app.use(flashMiddleware)

// 不同worker处理不同请求日志
app.use((req, res, next) => {
  if(cluster.isWorker) {
    console.log(`worker ${cluster.worker.id} received request`)
  }
  next()
})

// 定义路由
addRoutes(app)

// 自动化渲染视图
const autoViews = {}
const { promisify } = require('util')
const fileExists = promisify(fs.exists)

app.use(async (req, res, next) => {
  const path = req.path.toLowerCase()
  if (autoViews[path]) return res.render(autoViews[path], (err, html) => {
    if (err) {
      delete autoViews[path]
      res.redirect('/404')
    }
    res.send(html)
  })
  if (await fileExists(__dirname + '/views/' + path + '.handlebars')) {
    autoViews[path] = path.replace(/^\//, '')
    return res.render(autoViews[path])
  }
  next()
})

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