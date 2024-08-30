import { DragDropContext } from 'react-beautiful-dnd';
import { useState } from 'react';
import Column from './Column';
import FilterSortBar from './FilterSortBar';
import AddTaskModal from './AddTaskModal';
import { FaPlus } from 'react-icons/fa';

const Board = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDragEnd = (result) => {
    // Handle drag and drop logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <FilterSortBar />
      <div className="flex space-x-4 mt-8">
        <DragDropContext onDragEnd={onDragEnd}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </DragDropContext>
      </div>
      <button
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus />
      </button>
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Board;
