import React, { useMemo, useState, useEffect, useCallback } from "react";
import ColumnContainer from "./Column";
import TaskCard from "./TaskCard";
import dynamic from 'next/dynamic';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";

const DragOverlay = dynamic(
  () => import('@dnd-kit/core').then((mod) => mod.DragOverlay),
  { ssr: false }
);

const defaultCols = [
  { id: "todo", title: "Todo" },
  { id: "doing", title: "Work in progress" },
  { id: "done", title: "Done" },
];

function KanbanBoard() {
  const [columns, setColumns] = useState(defaultCols);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const { data: session, status } = useSession();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  useEffect(() => {
    setIsClient(true);
    if (status === "authenticated") {
      fetchTasks();
    } else if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  const createTask = useCallback(async (columnId) => {
    const newTask = {
      columnId,
      content: `New Task`,
      subtasks: []  // Initialize with an empty array
    };
  
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const createdTask = await response.json();
      setTasks(prevTasks => [...prevTasks, { ...createdTask, isNew: true, subtasks: [] }]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, []);

  const updateTask = useCallback(async (id, content, completed, subtasks, columnId) => {
    // Optimistically update the UI
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === id
          ? { ...task, content, completed, subtasks, columnId }
          : task
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, completed, subtasks, columnId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      
      // Update the state with the server response
      setTasks(prevTasks =>
        prevTasks.map(task => task._id === id ? { ...updatedTask, isNew: false } : task)
      );
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert the optimistic update if there's an error
      fetchTasks();  // Re-fetch all tasks to ensure consistency
    }
  }, [fetchTasks]);

  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // I'm dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });

      // Update task's column in the database
      const updatedTask = tasks.find((t) => t._id === activeId);
      if (updatedTask) {
        updateTask(
          activeId, 
          updatedTask.content, 
          updatedTask.completed, 
          updatedTask.subtasks, 
          overId
        );
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#7dd3fc" size={50} /> {/* Rose color for consistency */}
      </div>
    );
  }

  return (
    <div className=" flex h-full w-full items-center overflow-x-auto overflow-y-hidden px-4">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex  gap-4">
          <div className="flex  gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="h-[500px] w-[200px]  cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex items-center justify-center"
          >
            + Add Column
          </button>
        </div>

        {isClient && (
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;