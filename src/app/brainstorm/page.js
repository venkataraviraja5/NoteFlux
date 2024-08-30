"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useSession } from "next-auth/react";

const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw), {
  ssr: false,
});

export default function Brainstorm() {
  const [items, setItems] = useState([]);
  const [canvases, setCanvases] = useState([]);
  const [initialData, setInitialData] = useState({
    elements: [],
    appState: { viewBackgroundColor: "#ffffff" },
  });
  const [currentCanvasId, setCurrentCanvasId] = useState(null);
  const [canvasName, setCanvasName] = useState("Untitled Canvas");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const saveCanvas = useCallback(async () => {
    if (session?.data?.user?.id && items) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/canvasStore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.data.user.id,
            items: items,
            canvasId: currentCanvasId,
            name: canvasName,
          }),
        });

        if (response.ok) {
          const jsonResponse = await response.json();
          if (jsonResponse.canvasId && !currentCanvasId) {
            setCurrentCanvasId(jsonResponse.canvasId);
          }
          await getAllCanvases();
        } else {
          console.error("Failed to save canvas:", await response.text());
        }
      } catch (err) {
        console.error("Error saving canvas:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session?.data?.user?.id, items, currentCanvasId, canvasName]);

  const getAllCanvases = useCallback(async () => {
    if (session?.data?.user?.id) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/canvasStore?userId=${encodeURIComponent(session.data.user.id)}`);
        if (response.ok) {
          const json = await response.json();
          setCanvases(json.result);
        } else {
          console.error("Failed to fetch canvases:", await response.text());
        }
      } catch (err) {
        console.error("Error fetching canvases:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session?.data?.user?.id]);

  const loadCanvasById = useCallback(
    (canvasId) => {
      setIsLoading(true);
      const selectedCanvas = canvases.find((canvas) => canvas._id === canvasId);
      if (selectedCanvas) {
        const loadedItems = selectedCanvas.items || [];
        setInitialData({
          elements: loadedItems,
          appState: { viewBackgroundColor: "#ffffff" },
        });
        setItems(loadedItems);
        setCurrentCanvasId(canvasId);
        setCanvasName(selectedCanvas.name || "Untitled Canvas");
      } else {
        handleNewCanvas();
      }
      setIsLoading(false);
    },
    [canvases]
  );

  const handleCanvasNameChange = (e) => {
    const newName = e.target.value;
    setCanvasName(newName);
    setCanvases((prevCanvases) =>
      prevCanvases.map((canvas) =>
        canvas._id === currentCanvasId ? { ...canvas, name: newName } : canvas
      )
    );
  };

  useEffect(() => {
    if (session?.data?.user?.id) {
      getAllCanvases();
    }
  }, [session?.data?.user?.id, getAllCanvases]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (items && items.length > 0) {
        saveCanvas();
      }
    }, 2000);

    return () => clearTimeout(debounce);
  }, [items, saveCanvas]);

  const handleNewCanvas = useCallback(() => {
    setInitialData({
      elements: [],
      appState: { viewBackgroundColor: "#ffffff" },
    });
    setItems([]);
    setCurrentCanvasId(null);
    setCanvasName("Untitled Canvas");
  }, []);

  return (
    <>
      <Head>
        <title>Brainstorm with Excalidraw</title>
        <meta name="description" content="Collaborate and brainstorm using Excalidraw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen bg-gray-900">
        <div className="w-64 bg-gray-800 p-4 flex flex-col">
          <h1 className="text-white text-xl font-bold mb-4">Brainstorm</h1>
          <button 
            onClick={handleNewCanvas}
            disabled={isLoading}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mb-4"
          >
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              New Canvas
            </span>
          </button>
          <select
            onChange={(e) => loadCanvasById(e.target.value)}
            className="p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={currentCanvasId || ""}
            disabled={isLoading}
          >
            <option value="">Select a canvas</option>
            {canvases.map((canvas) => (
              <option key={canvas._id} value={canvas._id}>
                {canvas.name || `Canvas ${canvas._id}`}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={canvasName}
            onChange={handleCanvasNameChange}
            className="p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Canvas Name"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="text-white mt-4">Loading...</div>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <Excalidraw
              key={currentCanvasId || 'new'}
              theme="dark"
              initialData={initialData}
              onChange={(elements, state) => {
                setItems(elements);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}