"use client";
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const NoteCanvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [notes, setNotes] = useState([]);
  const [nextId, setNextId] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initCanvas = () => {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#f0f0f0',
        preserveObjectStacking: true
      });

      fabricCanvas.on('mouse:wheel', (opt) => {
        const delta = opt.e.deltaY;
        const zoom = fabricCanvas.getZoom();
        const newZoom = zoom * (1 + delta / 1000);
        fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      setCanvas(fabricCanvas);
    };

    initCanvas();

    const handleResize = () => {
      if (canvas) {
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [canvas]);

  const addNote = () => {
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }

    const note = new fabric.Textbox('New Note', {
      left: 50,
      top: 50,
      width: 200,
      height: 150,
      fill: '#000', // Text color
      backgroundColor: '#ffff00', // Bright background color for visibility
      borderColor: '#000',
      cornerColor: '#000',
      cornerSize: 8,
      transparentCorners: false,
      editable: true,
      id: nextId // Ensure unique ID
    });

    note.on('moving', (e) => {
      const { target } = e;
      const updatedNotes = notes.map(n =>
        n.id === target.id
          ? { ...n, left: target.left, top: target.top }
          : n
      );
      setNotes(updatedNotes);
    });

    canvas.add(note);
    canvas.renderAll(); // Ensure canvas is updated

    setNotes(prevNotes => [
      ...prevNotes,
      { id: nextId, left: note.left, top: note.top, text: note.text }
    ]);
    setNextId(prevId => prevId + 1);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black' }} // Add border to canvas for visibility
      />
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
          zIndex: 10 // Ensure the button is on top
        }}
        onClick={addNote}
      >
        +
      </button>
    </div>
  );
};

export default NoteCanvas;
