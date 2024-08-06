"use client";

import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../../components/RichTextEditor';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';


export default function PastePage() {
  const [text, setText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds
  const [sessions, setSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0); // Total time in seconds
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [subTasks, setSubTasks] = useState({});
  const [events, setEvents] = useState([]);
  const timerRef = useRef(null);

  const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds

  const handleChange = (content) => {
    setText(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pasted Text:', text);
    // You can also add any additional logic here, like sending the text to a backend server
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsBreak(false);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime === (isBreak ? BREAK_TIME : POMODORO_TIME)) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setTime(0);
            setSessions((prevSessions) => prevSessions + 1);
            setTotalTime((prevTotalTime) => prevTotalTime + (isBreak ? BREAK_TIME : POMODORO_TIME));
            alert(isBreak ? 'Break over! Time to work!' : 'Pomodoro session completed! Time for a break!');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const startBreak = () => {
    setIsBreak(true);
    setTime(0);
    startTimer();
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    clearInterval(timerRef.current);
    setTime(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current); // Clean up the interval on component unmount
    };
  }, []);

  const totalHours = (totalTime / 3600).toFixed(2); // Convert total time to hours

  const addTask = () => {
    const newTask = { text: taskText, dueDate: taskDueDate, completed: false };
    setTasks([...tasks, newTask]);
    setEvents([...events, {
      title: taskText,
      start: taskDueDate,
      allDay: true
    }]);
    setTaskText('');
    setTaskDueDate('');
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const addSubTask = (taskIndex, subTaskText) => {
    setSubTasks({
      ...subTasks,
      [taskIndex]: [...(subTasks[taskIndex] || []), { text: subTaskText, completed: false }],
    });
  };

  const toggleSubTaskCompletion = (taskIndex, subTaskIndex) => {
    const newSubTasks = { ...subTasks };
    newSubTasks[taskIndex][subTaskIndex].completed = !newSubTasks[taskIndex][subTaskIndex].completed;
    setSubTasks(newSubTasks);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
        <h1>Workspace</h1>
        <form onSubmit={handleSubmit}>
          <RichTextEditor value={text} onChange={handleChange} />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
            Submit
          </button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <h2>Preview:</h2>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>To-Do List:</h2>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Task Description"
              style={{ padding: '10px', fontSize: '16px', width: '60%' }}
            />
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', width: '20%' }}
            />
            <button onClick={addTask} style={{ padding: '10px 20px', fontSize: '16px' }}>
              Add Task
            </button>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => toggleTaskCompletion(index)}
                >
                  <span>{task.text}</span>
                  <span>{task.dueDate}</span>
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <h4>Subtasks</h4>
                  <ul>
                    {(subTasks[index] || []).map((subTask, subIndex) => (
                      <li
                        key={subIndex}
                        style={{
                          textDecoration: subTask.completed ? 'line-through' : 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleSubTaskCompletion(index, subIndex)}
                      >
                        {subTask.text}
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    placeholder="Add subtask"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        addSubTask(index, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    style={{ padding: '10px', fontSize: '16px', width: '60%' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ flex: '1 1 30%', minWidth: '200px', textAlign: 'center' }}>
        <h2>{isBreak ? 'Break' : 'Pomodoro'} Timer</h2>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
          {`${Math.floor(time / 60)
            .toString()
            .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}
        </div>
        <button onClick={isRunning ? pauseTimer : startTimer} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
          Reset
        </button>
        {isRunning && !isBreak && (
          <button onClick={startBreak} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
            Take a Break
          </button>
        )}
        <div style={{ marginTop: '20px' }}>
          <h3>Sessions Completed: {sessions}</h3>
          <h3>Total Time Spent: {totalHours} hours</h3>
        </div>
      </div>
      <div style={{ flex: '1 1 100%', marginTop: '20px' }}>
        <h2>Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={(info) => alert(`Event: ${info.event.title}`)}
        />
      </div>
    </div>
  );
}
