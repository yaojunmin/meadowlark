// 主页处理函数

const fortune = require('../lib/fortune')

exports.home = (req, res) => {
  console.log('monster', req.cookies.monster)
  console.log('signedMonster', req.signedCookies.signed_monster)
  res.cookie('monster', 'nom nom', {
    httpOnly: true
  })
  res.cookie('signed_monster', 'nom nom', { signed: true })
  res.render('home')
}

exports.about = (req, res) => {
  res.render('about', {fortune: fortune.getFortune()})
}

