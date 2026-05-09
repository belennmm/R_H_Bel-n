import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {

  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const seg = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }

  function toggleTimer() {
    setIsRunning(!isRunning);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(1500);
  }


  // aquí pongo los use effect para el timer 
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if(timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);



  return (
    <div>
      <h1>Belén's Pomodoro Timer</h1>

      <div className="timer-circle">
      <h2 className = "timer">{formatTime(timeLeft)}</h2> </div>
      
      <div className="buttons">
        <button onClick={toggleTimer}> {isRunning ? 'Pausa' : 'Iniciar'} </button>
        <button onClick={resetTimer}> Reiniciar </button>
      </div>
    </div>
  );
}


export default App;