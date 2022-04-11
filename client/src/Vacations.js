import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom'

function NotifyWhenInSeason({ sku }) {
  const [registeredEmail, setRegisteredEmail] = useState(null)
  const [email, setEmail] = useState('')

  function onSubmit(event) {
    fetch(`/api/vacation/${sku}/notify-when-in-season`, {
      method: 'post',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
      if (res.status < 200 || res.status > 299) 
        return alert('we had a problem processing this ... please try again.')
      setRegisteredEmail(email)
    })
    event.preventDefault();
  }

  if (registeredEmail) return (
    <i>you will be notified at {registeredEmail} when this vacation is back in season!</i>
  )
  return (
    <form onSubmit={onSubmit}>
      <i>notify me when this vacation is in season:</i>
      <input 
        type="email" 
        placeholder="(your email)" 
        value={email}
        onChange={({target: { value}}) => setEmail(value)} />
      <button>ok</button>
    </form>
  )
}

function Vacation({ vacation }) {
  return (
    <div key={vacation.sku}>
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      { !vacation.inSeason &&
        <div>
          <p><i>this vacation is not currently in season</i></p>
          <NotifyWhenInSeason sku={vacation.sku} />
        </div>    
      }
    </div>
  )
}

function Vacations() {
  // 初始状态
  const [vacations, setVacations] = useState([])

  // 初始数据
  useEffect(() => {
    fetch('/api/vacations')
      .then(res => res.json())
      .then(setVacations)
  }, [])

  return (
    <>
      <h2>vacations</h2>
      <div className="vacations">
        {
          vacations.map(vacation => 
           <Vacation key={vacation.sku} vacation={vacation} />
          )
        }
      </div>
    </>
  )
}
export default Vacations