const fetch = require('node-fetch')
const baseUrl = 'http://localhost:3000'

const _fetch = async (method, path, body) => {
  body = typeof body === 'string' ? body : JSON.stringify(body)
  const headers = { 'Content-Type': 'application/json' }
  const res = await fetch(baseUrl + path, { method, body, headers})
  if (res.status < 200 || res.status > 299) 
    throw new Error(`api returned status ${res.status}`)
  return res.json()
}

describe('api tests', () => {
  test('get /api/vacations', async () => {
    const vacations = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    expect(vacation0.name).toMatch(/\w/)
    expect(typeof vacation0.price).toBe('number')
  })

  test('get /api/vacation/:sku', async () => {
    const vacations = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    const vacation = await _fetch('get', '/api/vacation/' + vacation0.sku)
    expect(vacation.name).toBe(vacation0.name)
  })

  test('post /api/vacation/:sku/notify-when-in-season', async () => {
    const vacations = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    await _fetch('post', `/api/vacation/${vacation0.sku}/notify-when-in-season`, { email: 'test@meadowlarktravel.com' })
  })

  test('delete /api/vacation/:sku', async () => {
    const vacations = await _fetch('get', '/api/vacations')
    expect(vacations.length).not.toBe(0)
    const vacation0 = vacations[0]
    await _fetch('delete', `/api/vacation/${vacation0.sku}`)
  })
})