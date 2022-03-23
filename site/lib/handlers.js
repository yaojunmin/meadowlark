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

exports.api = {
  newsletterSignup: (req, res) => {
    console.log('csrf token (from hidden form field):' + req.body._csrf)
    console.log('name (from visible form field):' + req.body.name)
    console.log('email (from visible form field):' + req.body.email)
    res.send({result: 'success'})
  },
  vacationPhotoContest: (req, res, fields, files) => {
    console.log('field data:', fields)
    console.log('files:', files)
    res.send({result: 'sucess'})
  }
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