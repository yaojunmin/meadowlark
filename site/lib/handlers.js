const pathUtils = require('path')
const fs = require('fs')

exports.newsletterSignup = (req, res) => {
  res.render('newsletter-signup', { csrf: 'csrf token goes here'})
}

exports.newsletterSignupProcess = (req, res) => {
  console.log('csrf token (from hidden form field):' + req.body._csrf)
  console.log('name (from visible form field):' + req.body.name)
  console.log('email (from visible form field):' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you')
}

exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'csrf token goes here'})
}

exports.vacationPhotoContest = (req, res) => {
  res.render('./contest/vacation-photo', {
    csrf: 'csrf token goes here',
    year: '2022',
    month: '3'
  })
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('field data:', fields)
  console.log('files:', files)
  res.redirect(303, '/contest/vacation-photo-thank-you')
}

exports.vacationPhotoContestThankYou = (req, res) => {
  res.render('./contest/vacation-photo-thank-you')
}

exports.vacation = (req, res) => {
  res.render('./contest/vacation', {
    csrf: 'csrf token goes here',
    year: '2022',
    month: '3'
  })
}

const dataDir = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if (!fs.existsSync(vacationPhotosDir)) fs.mkdirSync(vacationPhotosDir)

function saveContestEntry(contestName, email, year, month, photoPath) {
  // todo
}

const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)

exports.api = {
  vacationPhotoContest: async (req, res, fields, files) => {
    const photo = files
    const dir = vacationPhotosDir + '/' + Date.now()
    // 安全性 使用浏览器提供名有风险
    const path = dir + '/' + photo.originalname
    await mkdir(dir)
    await rename(photo.path, path)
    saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path)
    res.send({ result: 'success' })
  },
  newsletterSignup: (req, res) => {
    console.log('csrf token (from hidden form field):' + req.body._csrf)
    console.log('name (from visible form field):' + req.body.name)
    console.log('email (from visible form field):' + req.body.email)
    res.send({result: 'success'})
  },
  // vacationPhotoContest: (req, res, fields, files) => {
  //   console.log('field data:', fields)
  //   console.log('files:', files)
  //   res.send({result: 'sucess'})
  // }
}