import './App.css';
import { useState, useEffect, useRef } from 'react';

const workTime = 1500; // 25 minutos
const breakTime = 300; // 5 minutos

function App2() {

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning , setIsRunning]  = useState(false) ;

  const [mode , setMode ] = useState('work') ; 
  const [sessions , setSessions] =  useState([]);

  const intervalRef = useRef(null) ;


  function formatTime(seconds){
    const min = Math.floor(seconds / 60) ;
    const seg =  seconds % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  }

  function toggleTimer() {
    setIsRunning(!isRunning ) ;
  }

  function resetTimer(){
    setIsRunning(false) ;
    setTimeLeft(workTime);
    setMode('work');
    setSessions([] );
  }


  // aquí pongo los use effect para el timer 
  useEffect(() => {
    if (isRunning && timeLeft >  0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000 ) ;
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft] );

  useEffect(() => {
    if (timeLeft === 0) {

    if (mode === 'work') {
        
        const newSession = {
            id: Date.now() ,
            type: 'work' ,
            duration: workTime,
            completedAt: new Date().toLocaleTimeString(),
        };
        
        setSessions(prev => [...prev, newSession]);

        setMode('break');
        setTimeLeft(breakTime);

        } 
        else {
            setMode('work'  );
            setTimeLeft(workTime ); }

        setIsRunning(true); }
    }, [timeLeft, mode]);



  return (
    <div>
      <h1>Belén's Pomodoro Timer 2</h1>

      <div className="timer-circle">
      <h2 className = "timer">{formatTime(timeLeft)}</h2> </div>
      
      <p>{mode === 'work' ? 'MODO DE TRABAJO' : 'MODO DE DESCANSO'}</p>

      <div className="buttons">
        <button onClick={toggleTimer}> {isRunning ? 'Pausa' : 'Iniciar'} </button>
        <button onClick={resetTimer}> Reiniciar </button>
      </div>

      <h3>SESIONES COMPLETADAS</h3>
      <ul>
        {sessions.map((session, index) => (
          <li key={session.id}>
                  Sesión {index + 1} - {formatTime(session.duration)} - {session.completedAt}

          </li>
        ))}
      </ul>

    </div>
    
  );
}


export default App2;