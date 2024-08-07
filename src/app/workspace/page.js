"use client";

import { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../../components/RichTextEditor';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function PastePage() {
  const [text, setText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [subTasks, setSubTasks] = useState({});
  const [events, setEvents] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const timerRef = useRef(null);

  const POMODORO_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const handleChange = (content) => {
    setText(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pasted Text:', text);
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
      clearInterval(timerRef.current);
    };
  }, []);

  const totalHours = (totalTime / 3600).toFixed(2);

  const addTask = () => {
    const newEvent = {
      id: Date.now(),
      title: taskText,
      start: selectedDate,
      allDay: true
    };
    setEvents([...events, newEvent]);
    setTasks([...tasks, { text: taskText, dueDate: selectedDate, completed: false }]);
    setTaskText('');
    setShowAddTaskModal(false);
  };

  const updateTask = () => {
    if (editingEvent) {
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id ? { ...event, title: taskText } : event
      );
      setEvents(updatedEvents);
      
      const updatedTasks = tasks.map(task => 
        task.dueDate === editingEvent.startStr && task.text === editingEvent.title
          ? { ...task, text: taskText }
          : task
      );
      setTasks(updatedTasks);
    } else {
      addTask();
    }
    setEditingEvent(null);
    setTaskText('');
    setShowAddTaskModal(false);
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

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowAddTaskModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setEditingEvent(clickInfo.event);
    setTaskText(clickInfo.event.title);
    setSelectedDate(clickInfo.event.startStr);
    setShowAddTaskModal(true);
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
          <h3>Total Time: {totalHours} hours</h3>
        </div>
      </div>
      <div style={{ flex: '1 1 100%', minWidth: '400px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          eventResizableFromStart={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
        {showAddTaskModal && (
          <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 1000 }}>
            <h3>{editingEvent ? 'Edit Task' : 'Add Task'}</h3>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Task name"
              style={{ padding: '10px', fontSize: '16px', width: '100%' }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={updateTask} style={{ padding: '10px 20px', fontSize: '16px' }}>
                {editingEvent ? 'Update' : 'Add'}
              </button>
              <button onClick={() => setShowAddTaskModal(false)} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
