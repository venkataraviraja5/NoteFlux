import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import Dialog from './Dialog'

const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(task.isNew);
  const [content, setContent] = useState(task.content);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
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

  useEffect(() => {
    if (task.isNew) {
      setEditMode(true);
    }
  }, [task.isNew]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteTask(task._id);
    setShowDeleteDialog(false);
  };

  const handleBlur = () => {
    updateTask(task._id, content, task.completed, task.subtasks || [], task.columnId);
    setEditMode(false);
  };

  const handleSubtaskUpdate = (subtaskId, completed) => {
    const updatedSubtasks = (task.subtasks || []).map(st =>
      st.id === subtaskId ? { ...st, completed } : st
    );
    updateTask(task._id, task.content, task.completed, updatedSubtasks, task.columnId);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskItem = { id: Date.now().toString(), content: newSubtask, completed: false };
      const updatedSubtasks = [...(task.subtasks || []), newSubtaskItem];
      updateTask(task._id, task.content, task.completed, updatedSubtasks, task.columnId);
      setNewSubtask("");
    }
  };

  const handleNewSubtaskChange = (e) => {
    setNewSubtask(e.target.value);
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
      className="bg-gray-800 p-4 rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative w-full mt-3"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => updateTask(task._id, task.content, !task.completed, task.subtasks, task.columnId)}
          className="form-checkbox h-4 w-4 text-rose-500 bg-gray-700 border-gray-600 focus:ring-rose-500 cursor-pointer"
        />
        {editMode ? (
          <textarea
            className="w-full resize-none border-none rounded bg-gray-700 text-white focus:outline-none p-2"
            value={content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                handleBlur();
              }
            }}
            autoFocus
          />
        ) : (
          <p 
            className={`flex-grow ${task.completed ? "line-through text-gray-500" : "text-white"}`} 
            onClick={toggleEditMode}
          >
            {task.content}
          </p>
        )}
        <button
          onClick={() => setShowSubtasks(!showSubtasks)}
          className="text-white hover:bg-gray-700 p-1 rounded"
        >
          {showSubtasks ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {showSubtasks && (
        <div className="mt-2 space-y-2">
          {(task.subtasks || []).map((subtask) => (
            <div key={subtask.id} className="flex items-center space-x-2 ml-6">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleSubtaskUpdate(subtask.id, !subtask.completed)}
                className="form-checkbox h-4 w-4 text-rose-500 bg-gray-700 border-gray-600 focus:ring-rose-500 cursor-pointer"
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
              onChange={handleNewSubtaskChange}
              onBlur={addSubtask}
              placeholder="New subtask"
              className="flex-grow bg-gray-700 text-white rounded px-2 py-1 text-sm cursor-text"
            />
            <button 
              onClick={addSubtask} 
              className="text-white bg-rose-500 hover:bg-rose-600 p-1 rounded"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* "Add Subtask" button */}
      <div className="mt-2">
        <button
          onClick={() => setShowSubtasks(true)}
          className="text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add Subtask
        </button>
      </div>

      {mouseIsOver && !editMode && (
        <button
          onClick={handleDeleteClick}
          className="absolute right-2 bottom-4 text-white opacity-60 hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>
      )}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskCard;