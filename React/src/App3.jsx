import './App.css';
import { useState, useEffect, useRef } from 'react';

function App3() {

  const [workMin, setWorkMin] =  useState(25) ;
  const [breakMin, setBreakMin] =useState(5);

  const workTime = workMin *  60 ;
  const breakTime =breakMin * 60 ;

  const [timeLeft, setTimeLeft] = useState(workTime) ;
  const [isRunning, setIsRunning] =useState(false);
  const [mode, setMode] = useState('work' );
  const [sessions, setSessions] =  useState([ ]);

  const intervalRef = useRef(null );

  const totalTime = mode ===  'work' ? workTime : breakTime ;
  const progress = ((totalTime - timeLeft) /  totalTime) *  100;

  const [message, setMessage] = useState('');


  function formatTime(seconds){

    const min = Math.floor(seconds /  60) ;
    const seg = seconds % 60 ;

    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart( 2, '0' )}`;
  }

  function toggleTimer(){
    setIsRunning( !isRunning);
  }

  function resetTimer() {
    setIsRunning(false );
    setTimeLeft(workTime );
    setMode('work' );
    setSessions([ ]);
  }

  function guardarPartialSession() {
    const elapsedTime  = totalTime - timeLeft;

    const partialSession  = {
      id: Date.now( ) ,
      type: `${mode} (parcial)`,
      duration: elapsedTime,
      completedAt: new Date( ).toLocaleTimeString( ) ,
    };

    setSessions(prev =>  [...prev, partialSession]);
  }

  useEffect(( ) => { 
    if(isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return ( ) => {
      clearInterval(intervalRef.current);
    };
  },  [isRunning, timeLeft]);


  useEffect(() => {
    if (timeLeft ===  0) {
      setMessage('¡El tiempo ha terminado!');

      setTimeout(() => { setMessage(''); }, 3000);

      if(mode === 'work') {
        const newSession = {
          id: Date.now(),
          type: 'work' ,
          duration: workTime,
          completedAt: new Date().toLocaleTimeString(),
        } ;

        setSessions(prev => [...prev, newSession]);
        setMode('break');

        setTimeLeft(breakTime); 

      } 
      else{
        setMode('work') ;
        setTimeLeft(workTime);
      }

      setIsRunning(true);
    }
  }, [timeLeft, mode, workTime, breakTime]);


  const totalWorkSessions = sessions.filter(session => session.type === 'work').length;


  const totalWorkTime  = sessions.filter(session => session.type === 'work').reduce((total, session) => total +  session.duration , 0);



  return (
    <div className="pomodoro-container">
      <h1>Belén's Pomodoro Timer Deluxe</h1>

      {message && <p className="message">{message}</p>}

      <div className="timer-circle">
        <h2 className="timer">{formatTime(timeLeft)}</h2>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <p>{mode === 'work' ? 'MODO DE TRABAJO' : 'MODO DE DESCANSO'}</p>

      <div className="config">
        <label>
          Trabajo:
          <input
            type="number" min="1" max="60"
            value={workMin}
            disabled={isRunning}
            onChange={(e) => { const value = Number(e.target.value); setWorkMin(value); setTimeLeft(value * 60);  }} />
        </label>

        <label>
          Descanso:
          <input
            type="number" min="1" max="60"
            value={breakMin}
            disabled={isRunning}
            onChange={(e) => {const value = Number(e.target.value); setBreakMin(value); }} />
        </label>
      </div>

      <div className="buttons">
        <button onClick={toggleTimer}> {isRunning ? 'Pausar' : 'Iniciar'} </button>

        <button onClick={ resetTimer}>Reiniciar</button>

        <button onClick= {guardarPartialSession} disabled={!isRunning}> Guardar sesión Parcial</button>
      </div>

      <div className="stats">
        <h3>Estadísticas</h3>

        <p>Sesiones de trabajo: {totalWorkSessions} </p>

        <p>Tiempo total trabajado: {formatTime(totalWorkTime)}</p>
      </div>

      <h3>SESIONES COMPLETADAS</h3>
      <ul>
        {sessions.map((session, index) => (
          <li key={session.id}>
            Sesión {index + 1} - {session.type} - {formatTime(session.duration)} - {session.completedAt }
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App3;