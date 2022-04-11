import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import logo from './img/logo.png'
import './App.css'
import Vacations from './Vacations'

function Home() {
  return (
    <div>
      <h2>welcome to meadowlark travel</h2>
      <p>check out our "<Link to="/about">about</Link>"page!</p>
    </div>  
  )
}

function About() {
  return <i>coming soon</i>
}

function NotFound() {
  return <i>not found</i>
}

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>meadowlark travel</h1>
          <Link to="/">
            <img src={logo} alt="meadowlark travel logo" />
          </Link>
        </header>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/vacations" element={<Vacations />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
