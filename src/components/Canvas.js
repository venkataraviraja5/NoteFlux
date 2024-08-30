"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Draggable from 'react-draggable';

// Dynamically import Excalidraw with SSR disabled
const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then(mod => mod.Excalidraw), { ssr: false });

const Note = () => {
  const [instances, setInstances] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  const addInstance = () => {
    setInstances([...instances, { id: Date.now() }]);
  };

  const handleMouseDown = (id) => {
    setDraggingId(id);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-yellow-200">
      {instances.map(({ id }) => (
        <Draggable
          key={id}
          defaultPosition={{ x: 100, y: 100 }}
          disabled={draggingId !== id} // Disable dragging if not the active instance
        >
          <div
            className="w-4/5 h-4/5 border border-gray-800 bg-gray-600 relative rounded-lg overflow-hidden" // Added overflow-hidden for rounded corners effect
            onMouseDown={() => handleMouseDown(id)} // Enable dragging on mouse down
            onMouseUp={handleMouseUp} // Reset dragging state on mouse up
            style={{ cursor: 'move' }} // Show move cursor for better UX
          >
            <div className="w-full h-full relative rounded-lg">
              <Excalidraw
                style={{ width: '100%', height: '100%' }}
                initialData={{
                  appState: {
                    theme: 'dark', // Set the Excalidraw theme to dark
                  },
                }}
              />
            </div>
          </div>
        </Draggable>
      ))}
      <button
        onClick={addInstance}
        className="absolute bottom-5 right-5 text-3xl bg-white border border-black rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-10 text-black"
      >
        +
      </button>
    </div>
  );
};

export default Note;
