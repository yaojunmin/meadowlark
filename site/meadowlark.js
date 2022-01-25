const express = require('express')
const engine = require('express-handlebars')
const fortune = require('./lib/fortune')
const app = express()

// app.disable('x-powered-by')
app.engine('handlebars', engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => res.render('home'))

app.get('/about', (req, res) => {
  res.render('about', {fortune: fortune.getFortune()})
})

app.get('/header', (req, res) => {
  res.type('text/plain')
  const header = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
  res.send(header.join('\n'))
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