"use client"
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const initialData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2']
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4']
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-5']
    }
  },
  tasks: {
    'task-1': { id: 'task-1', content: 'Task 1' },
    'task-2': { id: 'task-2', content: 'Task 2' },
    'task-3': { id: 'task-3', content: 'Task 3' },
    'task-4': { id: 'task-4', content: 'Task 4' },
    'task-5': { id: 'task-5', content: 'Task 5' }
  },
  columnOrder: ['column-1', 'column-2', 'column-3']
};

const KanbanDashboard = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      };

      setData(newState);
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      };

      setData(newState);
    }
  };

  const renderTask = (task, index) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            padding: 16,
            margin: '0 0 8px 0',
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            ...provided.draggableProps.style
          }}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );

  const renderColumn = (column) => (
    <Droppable droppableId={column.id} key={column.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            margin: '0 8px',
            padding: 8,
            background: '#e2e4e6',
            borderRadius: 4,
            width: '100%'
          }}
        >
          <h3>{column.title}</h3>
          {column.taskIds.map((taskId, index) =>
            renderTask(data.tasks[taskId], index)
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', overflow: 'auto' }}>
        {data.columnOrder.map((columnId) => (
          <ResizableBox
            key={columnId}
            width={300}
            height={Infinity}
            minConstraints={[150, Infinity]}
            maxConstraints={[500, Infinity]}
            resizeHandles={['e']}
            style={{ display: 'inline-block', margin: '0 8px' }}
          >
            {renderColumn(data.columns[columnId])}
          </ResizableBox>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanDashboard;
