const db = require('./db')
const geocode = require('./lib/geocode')

const geocodeVacations = async () => {
  const vacations = await db.getVacations()
  const vacationsWithoutCoordinates = vacations.filter(({ location }) => 
    !location.coordinates || typeof location.coordinates.lat !== 'number')
  console.log(`geocoding ${vacationsWithoutCoordinates} 
              of ${vacations.length} vacations;`)
  return Promise.all(vacationsWithoutCoordinates.map(async ({ sku, location }) => {
    const { search } = location
    if(typeof search !== 'string' || !/\w/.test(search))
      return console.log(`sku ${sku} failed:does not have location.search`)
    try {
      const coordinates = await geocode(search)
      await db.updateVacationBySku(sku, { lacation: { search, coordinates }})
      console.log(`sku ${sku} succeeded: ${coordinates.lat},${coordinates.lng}`)
    } catch (err) {
      return console.log(`sku ${sku} failed: ${err.message}`)
    }
  }))
}

geocodeVacations()
  .then(() => {
    console.log('done')
    db.close()
  })
  .catch(err => {
    console.error('error: ' + err.message)
    db.close()
  })