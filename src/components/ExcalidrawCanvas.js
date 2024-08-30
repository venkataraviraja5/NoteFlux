'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import dynamic from 'next/dynamic';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw), { ssr: false });

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [excalidrawInstances, setExcalidrawInstances] = useState([]);

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f5f5f5',
      selection: false,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const canvas = fabricCanvas.current;

    // Enable dragging and zooming
    let isDragging = false;
    let lastPosX;
    let lastPosY;

    canvas.on('mouse:down', (e) => {
      if (e.e.shiftKey) {
        isDragging = true;
        lastPosX = e.e.clientX;
        lastPosY = e.e.clientY;
      }
    });

    canvas.on('mouse:move', (e) => {
      if (isDragging) {
        const deltaX = e.e.clientX - lastPosX;
        const deltaY = e.e.clientY - lastPosY;
        lastPosX = e.e.clientX;
        lastPosY = e.e.clientY;
        canvas.relativePan({ x: deltaX, y: deltaY });
      }
    });

    canvas.on('mouse:up', () => {
      isDragging = false;
    });

    canvas.on('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const zoom = canvas.getZoom();
      const newZoom = e.deltaY > 0 ? zoom * (1 - zoomFactor) : zoom * (1 + zoomFactor);
      canvas.setZoom(newZoom);
    });

    // Adjust Fabric.js canvas size on window resize
    window.addEventListener('resize', () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    });

    return () => {
      fabricCanvas.current?.dispose();
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const addExcalidrawPage = () => {
    // Create a container for the Excalidraw editor
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    container.style.position = 'absolute';
    container.style.top = '100px';
    container.style.left = '100px';
    container.style.zIndex = '1'; // Ensure it's on top of other elements
    container.style.backgroundColor = '#e0e0e0'; // Light grey background

    // Add the container to the document body
    document.body.appendChild(container);

    // Create a new Excalidraw instance inside the container
    if (typeof window !== 'undefined') {
      const ExcalidrawComponent = Excalidraw;
      const excalidrawInstance = document.createElement('div');
      excalidrawInstance.style.width = '100%';
      excalidrawInstance.style.height = '100%';
      container.appendChild(excalidrawInstance);
      
      // Ensure Excalidraw is rendered correctly
      const excalidraw = new ExcalidrawComponent({ container: excalidrawInstance });
      excalidraw.render();

      // Save instance for later use
      setExcalidrawInstances((prevInstances) => [...prevInstances, { container, excalidrawInstance }]);
    }

    // Create a Fabric.js object to represent the Excalidraw container
    const fabricObject = new fabric.Rect({
      left: 100,
      top: 100,
      width: 800,
      height: 600,
      fill: 'transparent', // Transparent background
      stroke: '#000',
      strokeWidth: 2,
      selectable: true,
      evented: true,
    });

    fabricObject.set({
      element: container,
    });

    fabricCanvas.current.add(fabricObject);
    fabricCanvas.current.setActiveObject(fabricObject);
    fabricCanvas.current.renderAll();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid #ddd', width: '100%', height: '100%' }} />
      <button
        onClick={addExcalidrawPage}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add Excalidraw Page
      </button>
    </div>
  );
};

export default Canvas;
