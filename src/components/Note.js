import { useRef } from 'react';
import Draggable from 'react-draggable';

const Note = ({ title, content, position, onDrag, onContentChange }) => {
  const nodeRef = useRef(null);

  const handleContentChange = (e) => {
    onContentChange(e.target.value);
  };

  return (
    <Draggable nodeRef={nodeRef} onStop={(e, data) => onDrag({ top: data.y, left: data.x })}>
      <div
        ref={nodeRef}
        className="bg-gray-700 border border-gray-700 rounded-lg p-4 m-2 w-60 cursor-move"
      >
        <input
          type="text"
          className="w-full bg-transparent border-none text-gray-100 text-lg font-bold outline-none mb-2"
          defaultValue={title}
          placeholder="Title"
        />
        <textarea
          className="w-full h-32 bg-transparent border-none text-gray-100 resize-none outline-none"
          defaultValue={content}
          onChange={handleContentChange}
          placeholder="Write something..."
        />
      </div>
    </Draggable>
  );
};

export default Note;
