const fortuneCookies = [
  'a',
  'b',
  'c',
  'd',
  'f',
]

exports.getFortune = () => {
  const idx = Math.floor(Math.random() * fortuneCookies.length)
  return fortuneCookies[idx]
}