"use client"
// pages/brainstorm.js
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

// Dynamically import Excalidraw so that it only loads on the client-side
const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw), {
  ssr: false,
});

export default function Brainstorm() {
  const excalidrawRef = useRef(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  useEffect(() => {
    if (excalidrawRef.current) {
      setExcalidrawAPI(excalidrawRef.current);
    }
  }, [excalidrawRef]);

  return (
    <>
      <Head>
        <title>Brainstorm with Excalidraw</title>
        <meta name="description" content="Collaborate and brainstorm using Excalidraw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex items-center justify-center">
      <div style={{ height: "90vh", width: "90vw", display: "flex", flexDirection: "column", backgroundColor: "black" }}>
        <div style={{ flexGrow: 1 }}>
          <Excalidraw
            ref={excalidrawRef}
            theme="dark" // Set the theme to dark
            style={{ height: "100%", width: "100%" }} // Ensure Excalidraw fills the container
          />
        </div>
      </div>
      </div>
    </>
  );
}
