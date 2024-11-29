import React, { useState, useEffect } from "react";

const Timer = () => {
 
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(null); 
  const [completed, setCompleted] = useState(false); 
  const [buildTime, setBuildTime] = useState(null); // Storing build time

  const assessmentId = "674a004014373c00db79c8b4"; 

  // Fetch start time from the backend
  const fetchStartTime = async () => {
    const response = await fetch(`http://localhost:5000/api/github/assessment-details/${assessmentId}`);
    const data = await response.json();
    const startTime = new Date(data.data.start_time); 
    setStartTime(startTime);
  };

  // Starting timer 
  const handleStart = () => {
    if (startTime && !timerRunning) {
      setTimerRunning(true);
      setPaused(false);

      const start = Date.now() - elapsedTime * 1000; 
      const intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      setTimer(intervalId); 
    }
  };

  // Pause
  const handlePause = () => {
    setTimerRunning(false);
    setPaused(true);
    clearInterval(timer); // Stop the timer
  };

  // Complete button
  const handleDone = async () => {
    clearInterval(timer);
    setTimerRunning(false);
    const endTime = new Date();
    
    try {
      // Sending the start time, end time to the backend to save the session
      const response = await fetch("http://localhost:5000/api/timer/complete-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }), 
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Session saved successfully:", result);
        setCompleted(true); 
        setBuildTime(result.build_time); 
      } else {
        console.error("Error saving end time:", result.message);
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  // Reset 
  const handleReset = () => {
    clearInterval(timer); 
    setTimerRunning(false); 
    setElapsedTime(0); 
    setPaused(false); 
    setCompleted(false); 
    setBuildTime(null); 
  };

  // Format elapsed time 
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // fetching starting time "assessment_start_time"
  useEffect(() => {
    fetchStartTime();
  }, []);

  
  const convertMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours ${remainingMinutes} minutes`;
  };

  return (
    <div className="timer-container">
      <h1>Timer</h1>
      <div className="timer">
        <h1>{formatTime(elapsedTime)}</h1>
      </div>

      <button className="start" onClick={handleStart} disabled={timerRunning || !startTime || completed}>
        Start
      </button>
      <button className="pause" onClick={handlePause} disabled={!timerRunning}>
        Pause
      </button>
      <button className="done" onClick={handleDone} disabled={!timerRunning && !paused}>
        Done
      </button>
      <button className="reset" onClick={handleReset} disabled={!completed && !elapsedTime}>
        Reset
      </button>

      
      {buildTime && (
        <div className="build-time">
          <h2>Session Duration:</h2>
          <p>{convertMinutesToHours(buildTime.minutes)}</p>
        </div>
      )}
    </div>
  );
};

export default Timer;
