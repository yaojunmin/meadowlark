const mongoose = require('mongoose')
const { credentials } = require('./config')
const Vacation = require('./models/vacation')
const VacationInSeasonListener = require('./models/vacationInSeasonListener')

const { connectionString } = credentials.mongo
if (!connectionString) {
  console.error('mongodb connection string missing!')
  process.exit(1)
}
// 链接数据库
mongoose.connect(connectionString)
const db = mongoose.connection
db.on('error', err => {
  console.error(`mongodb error ${err.message}`)
  process.exit(1)
})
db.once('open', () => console.log('mongodb connection established'))

// 初始化数据
// 查询
Vacation.find((err, vacations) => {
  if (err) return console.error(err)
  if (vacations.length) return
  // 保存
  new Vacation({
    name: 'hood river day trip',
    slug: 'hood-river-day-trip',
    category: 'day trip',
    sku: 'hr199',
    description: 'spend a day sailing on the columbia and enjoying craft beer in hood river!',
    price: 99.95,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save()
  new Vacation({
    name: 'hood river day trip 2 ',
    slug: 'hood-river-day-trip 2 ',
    category: 'day trip',
    sku: 'hr199',
    description: 'spend a day sailing on the columbia and enjoying craft beer in hood river!',
    price: 99.95,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save()
  new Vacation({
    name: 'hood river day trip 3',
    slug: 'hood-river-day-trip 3',
    category: 'day trip',
    sku: 'hr199',
    description: 'spend a day sailing on the columbia and enjoying craft beer in hood river!',
    price: 99.95,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save()
})

module.exports = {
  getVacations: async (options = {}) => Vacation.find(options),
  addVacationInSeasonListener: async (email, sku) => {
    await VacationInSeasonListener.updateOne(
      { email },
      { $push: { skus: sku }},// 追加
      { upsert: true }// update+insert
    )
  }
}