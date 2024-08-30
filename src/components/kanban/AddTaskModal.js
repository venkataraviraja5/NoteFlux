import Modal from 'react-modal';
import { useState } from 'react';

// Set the root element as #app instead of #__next
// Modal.setAppElement('#app');

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: taskTitle }); // Pass the new task data back to the parent
    setTaskTitle('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-white font-bold text-lg mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          className="bg-gray-700 text-white w-full p-2 rounded-lg mb-4"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button className="bg-blue-500 text-white w-full p-2 rounded-lg">Add Task</button>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
