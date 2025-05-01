import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router,
  Routes,
  Route,
  Link} from "react-router-dom";
import './App.css';
import { MyGame } from './MyGame.js';

/*****************************   
 * Part 1. Route
******************************/

function MyRouteApp() {
  // global variable "game":
  // It stores the configurations, the state of the game, 
  // and an object "number" which is used to generate answer
  // and verify input.
  const [game, _] = useState(new MyGame());
  // variables in "home page".
  // "currNum": the current number input by a player.
  // "nums": history numbers input by a player.
  const [currNum, setCurrNum] = useState('');
  const [nums, setNums] = useState([]);
  // variables in "settings page".
  // the names of the following variables explain their utility.
  const [lives, setLives] = useState(7);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  return (
    <>
      <Routes>
        <Route path="/" element={
            <Home game={game} 
                  currNum={currNum} setCurrNum={setCurrNum}
                  nums={nums} setNums={setNums}/>} />
        <Route path="/Settings" element={
            <Settings game={game}
                      lives={lives} setLives={setLives}
                      min={min} setMin={setMin}
                      max={max} setMax={setMax}/>} />
        <Route path="/Records" element={
            <Records game={game} />} />
        <Route path="*" element={<My404 />} />
      </Routes>
    </>
  );
}

/*************************************  
 * Part 2. NavBar
**************************************/

// Navigation Bar
function NavBar() {
  return (
    <>
      <hr />
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/Settings">Settings</Link>
        <Link to="/Records">Records</Link>
      </div>
      <hr />
    </>
  );
}

/*******************************************  
 * Part 3. The first page - Home
 * Goto line 247 to check out the framework.
********************************************/

// Light weight JSX component for "InputForm", which will then be
// referenced in "GameBoard".
// Notify the player to input a number between "min" and "max".
function InputInfo({min, max}) {
  return <span>Enter a number between {min} and {max}: </span>
}

// Light weight JSX component for "GameBoard".
// Notify the player how many "lives" left.
function LifeInfo({game}) {
  return <div>You have {game.number.lives} lives left.</div>
}

// Light weight JSX component for "GameBoard".
// Display the result when game is over.
function GameResult({resultID, ans}) {
  var text;
  if (resultID==3) {
    text = "You Win!";
  } else {
    text = "You Lose!";
  }
  return <span>{text} The answer is {ans}.</span>
}

// Light weight JSX component for "GameBoard".
// It provides a form like panel where the player can input numbers.
function InputForm(props) {
  return (<>
    <form id='inputForm'>
      <InputInfo min={props.game.number.min} max={props.game.number.max} />
      <input type='text' name='newNumber' value={props.currNum}
        onChange={(e)=>props.setCurrNum(e.target.value)} />
      <button id="btnInput" onClick={(e)=>props.handleNewNumber(e)}>Enter</button>
      <button id="btnRestart" onClick={(e)=>props.handleRestart(e)}>Restart</button>
    </form>
  </>);
}

// Light weight JSX component for "GameBoard".
// It provides a list of history numbers, along with
// corresponding response.
// e.g. "22 - too high"
//      "12 - too low"
function NumbersList({nums}) {
  return (<>
    <ul className='state-list'>
      {nums.map((st, i)=><li key={i}>{st}</li>)}
    </ul>
  </>);
}

// The "GameBoard" is a JSX component, it provides a block of 
// code which enables a player to input numbers and see 
// the response.
function GameBoard(props) {

  // Claim root reference
  // "rootResultRef" refers to a "div" element which displays "GameResult"
  // when a game is over. It utilizes reference feature so that a root
  // element won't be created (ReactDOM.createRoot) by multiple times.
  const rootResultRef = useRef(null);

  // Render the "gameboard" if the game is over or a new game
  // is started. 
  useEffect(()=>{    
    const divResult = document.getElementById('result');
    // Create root once and store it in the ref
    if (!rootResultRef.current) {
      rootResultRef.current = ReactDOM.createRoot(divResult);
    }
    // If game is over, turn off input button, display a restart
    // button as well as the correct answer. 
    if (!props.game.playing) {
      switchButtons(true, 'block');
      displayResult(rootResultRef.current);
    // If new game start, turn of input button, hide the restart
    // button as well as the last correct answer.
    } else {
      switchButtons(false, 'none');
      hideResult(rootResultRef.current);
    }
  }, [props.game.playing]);

  // helper function to display, hide, enable, or disable buttons.
  function switchButtons(state1, state2) {
    const btnInput = document.getElementById("btnInput");
    btnInput.disabled = state1;

    const btnRestart = document.getElementById("btnRestart");
    btnRestart.style.display = state2;
  }

  // helper function to display game result.
  function displayResult(rootResult) {
    const result = <GameResult resultID={props.game.resultID}
                               ans={props.game.number.answer} />;
    rootResult.render(result);
  }

  // helper function to hide game result.
  function hideResult(rootResult) {
    rootResult.render(null);
  }

  // event handeler:
  // when the "restart" button is clicked, execute this function.
  function handleRestart(e) {
    e.preventDefault();
    // clear the history inputs.
    props.setNums([]); 
    props.game.restart();
  }

  // event handeler:
  // when the "enter" button is clicked, execute this function.
  function handleNewNumber(e) {
    e.preventDefault();
    // if nothing is input, do nothing.
    if (props.currNum=='') 
      return;
    // request the "number" object to verify the input text, 
    // and it will return a code implying different situations.
    switch (props.game.number.verifyNum(Number(props.currNum))){
      case -2: // when the input text is not an integer.
        alert("Please enter an integer.");
        break;
      case -1: // when the input number is outside the range.
        alert("Please enter an integer between " 
        + props.game.number.min + " and " + props.game.number.max);
        break;
      case 1: //  when the input number is too low.
        props.setNums(n=> [...n, props.currNum + " - too low"]);
        props.setCurrNum("");
        if (props.game.number.lives==0) {
          props.game.stop(1);
        }
        break;
      case 2: // when the input number is too high.
        props.setNums(n=> [...n, props.currNum + " - too high"]);
        props.setCurrNum("");
        if (props.game.number.lives==0) {
          props.game.stop(2);
        }
        break;
      case 3: // when the input number is correct.
        props.setNums(n=> [...n, props.currNum + " - correct"]);
        props.setCurrNum("");
        props.game.totalGuesses += props.game.number.guessSpent;
        props.game.winCount++;
        props.game.stop(3);
        break;
    }
  }

  return (
    <>
      <div id='gameboard'>
        <InputForm game={props.game} 
                  currNum={props.currNum} setCurrNum={props.setCurrNum}
                  handleRestart={handleRestart} 
                  handleNewNumber={handleNewNumber} />
        <LifeInfo game={props.game} />
        <hr />
        <NumbersList nums={props.nums} />
        <div id='result'></div>
      </div>
    </>
  );
}

// Home page: a virtual page where a player can guess the number.
function Home(props) {
  return (
  <>
    <NavBar />
    <GameBoard {...props} />
  </>
  );
}

/*************************************************  
 * Part 4. The second page - Settings
 * Goto line 353 to check out the framework.
**************************************************/

// Light weight JSX component for "ConfigBoard".
// It provides a panel where the player can modify "lives";
function ConfigLives({lives, setLives}) {
  return (<>
    <div id="ConfigLine1">
      <span>Each game has </span>
      <input type='text' name='lives' value={lives}
            onChange={(e)=>setLives(e.target.value)} />
      <span> lives.</span>
    </div>
  </>);
}

// Light weight JSX component for "ConfigBoard".
// It provides a panel where the player can modify min. and max. number;
function ConfigMinMax({min, setMin, max, setMax}) {
  return (<>
    <div id="ConfigLine2">
      <span>Number range from </span>
      <input type='text' name='min' value={min}
            onChange={(e)=>setMin(e.target.value)} />
      <span> to </span>
      <input type='text' name='max' value={max}
            onChange={(e)=>setMax(e.target.value)} />
    </div>
  </>);
}

// The "ConfigBoard" is a JSX component, it provides a block of 
// code which enables a player to make configurations.
function ConfigBoard({game,
                      lives, setLives,
                      min, setMin,
                      max, setMax}) {
  // helper function
  // return true if "num" is not a number.
  // e.g. 14 - false 
  //      "14" - false
  //      "abc" - true
  function notNumber(num)
  {
    if (!Number.isInteger(parseInt(num)))
      return true;
    return false;
  }

  // verify if the 'lives' variable is a qualified number.
  useEffect(()=>{
    if (notNumber(lives) || parseInt(lives)<=0) {
      alert("Lives must be a positive integer!");
      setLives(game.lives); // reset 'lives' as the origional number.
    } else {
      game.lives = parseInt(lives);
    }
  }, [lives]);

  // verify if the 'min' variable is a qualified number.
  useEffect(()=>{
    if (notNumber(min) || parseInt(min)<=0) {
      alert("Minimum number must be a positive integer!");
      setMin(game.min);
    } else if (parseInt(min)>=game.max) {
      alert("Minimum number must be less than maximum number!");
      setMin(game.min);
    } else {
      game.min = parseInt(min);
    }
  }, [min]);

  // verify if the 'max' variable is a qualified number.
  useEffect(()=>{
    if (notNumber(max) || parseInt(max)<=0) {
      alert("Maximum number must be a positive integer!");
      setMax(game.max);
    } else if (parseInt(max)<=game.min) {
      alert("Maximum number must be larger than minimum number!");
      setMax(game.max);
    } else {
      game.max = parseInt(max);
    } 
  }, [max]);

  return (
    <>
      <div>Warning: The change won't take effect until the next game!</div>
      <ConfigLives lives={lives} setLives={setLives} />
      <ConfigMinMax min={min} setMin={setMin} max={max} setMax={setMax} />
    </>
  )
}

// Setting page: a virtual page where a player can make configurations.
function Settings(props) {
  return <>
    <NavBar />
    <ConfigBoard {...props}/>
  </>
}

/*************************************  
 * Part 5. The third page - Records
**************************************/

// The "HistoryBoard" is a JSX component, it provides a block of 
// code which enables a player to see historical win records.
function HistoryBoard({game}) {
  var avgGuesses = game.totalGuesses/game.winCount;
  if (isNaN(avgGuesses)) {
    avgGuesses = 0;
  }
  return (
    <>
      <p>You have won {game.winCount} games!</p>
      <p>On average, it takes {(avgGuesses).toFixed(2)} guesses per game.</p>
    </>
  )
}

// Setting page: a virtual page where a player can see win records.
function Records({game}) {
  return (
    <>
      <NavBar />
      <HistoryBoard game={game} />
    </>
  )
}

/*************************************  
 * Part 6. The fourth page - 404 Page
**************************************/

// any unknown pages go here.
function My404() {
  return <><NavBar /><h2>Page not found!</h2></>
}

/*************************************  
 * Part 7. App
**************************************/

function App() {
  return (
    <>
      <div className="container">
        <header>
            <h2>Homework 10 : Guess Number</h2>
        </header>
        <Router>
          <MyRouteApp />
        </Router>
      </div>
    </>
  );
}

export default App
