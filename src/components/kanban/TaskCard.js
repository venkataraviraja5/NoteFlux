import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";

const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const handleCheckboxChange = () => {
    updateTask(task.id, task.content, !task.completed);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      updateTask(task.id, task.content, task.completed, [
        ...(task.subtasks || []),
        { id: Date.now(), content: newSubtask, completed: false },
      ]);
      setNewSubtask("");
    }
  };

  const updateSubtask = (subtaskId, completed) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed } : st
    );
    updateTask(task.id, task.content, task.completed, updatedSubtasks);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-gray-800 p-4 rounded-xl border-2 border-rose-500 cursor-grab"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 p-4 rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleCheckboxChange}
          className="form-checkbox h-4 w-4 text-rose-500 bg-gray-700 border-gray-600 focus:ring-rose-500"
        />
        {editMode ? (
          <textarea
            className="w-full resize-none border-none rounded bg-gray-700 text-white focus:outline-none p-2"
            value={task.content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
            onChange={(e) => updateTask(task.id, e.target.value, task.completed, task.subtasks)}
          />
        ) : (
          <p
            className={`flex-grow ${task.completed ? "line-through text-gray-500" : "text-white"}`}
            onClick={toggleEditMode}
          >
            {task.content}
          </p>
        )}
        {task.subtasks && task.subtasks.length > 0 && (
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="text-white"
          >
            {showSubtasks ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {showSubtasks && task.subtasks && (
        <div className="mt-2 space-y-2">
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center space-x-2 ml-6">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => updateSubtask(subtask.id, !subtask.completed)}
                className="form-checkbox h-4 w-4 text-rose-500 bg-gray-700 border-gray-600 focus:ring-rose-500"
              />
              <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : "text-white"}`}>
                {subtask.content}
              </span>
            </div>
          ))}
          <div className="flex items-center space-x-2 ml-6">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="New subtask"
              className="flex-grow bg-gray-700 text-white rounded px-2 py-1 text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addSubtask();
                }
              }}
            />
            <button onClick={addSubtask} className="text-white">
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="absolute right-2 top-2 text-white opacity-60 hover:opacity-100"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
