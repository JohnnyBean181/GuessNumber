import { useState, useEffect } from 'react'
import { BrowserRouter as Router,
  Routes,
  Route,
  Link} from "react-router-dom";
import './App.css'

function MyRouteApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Records" element={<Records />} />
        <Route path="*" element={<My404 />} />
      </Routes>
    </>
  )
}

function NavBar() {
  return (
    <>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/Settings">Settings</Link>
        <Link to="/Records">Records</Link>
      </div>
    </>
  );
}

function Home() {

  return (
  <>
    <NavBar />
    <h2>Home</h2>
    Here is some info about this website.
  </>
  )
}

function Settings() {
  return <>
  <NavBar />
  <h2>Settings</h2>
  Here is some info about this website.</>
}

function Records() {
  return <>
  <NavBar />
  <h2>History Records</h2>
  Here is some info about this website.</>
}

function My404() {
  return <><NavBar /><h2>Page not found!</h2></>
}

class Number {
  constructor(lives=7, min=1, max=100)
  {
    this.answer;
    this.lives=lives;
    this.min=min;
    this.max=max;
    this.setupAnswer();
  }
  setupAnswer()
  {
    this.answer = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    console.log(this.answer);
  }
  verifyNum(num)
  {
    if (this.outbound(num)) {
      return -1;
    } else if (num < this.answer) {
      return 1;
    } else if (num > this.answer) {
      return 2;
    } else if (num == this.answer) {
      return 3;
    }
  }
  outbound(num)
  {
    if (num>this.maxNum || num<this.minNum)
      return true;
    return false;
  }
}

function App() {
  var firstNumber = new Number();
  const [number, setNumber] = useState(firstNumber);

  return (
    <>
      <div className="container">
        <header>
            <h2>Guess Number</h2>
        </header>
        <Router>
          <MyRouteApp />
        </Router>
      </div>
    </>
  );
}

export default App
